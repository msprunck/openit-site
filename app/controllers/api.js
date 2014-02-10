'use strict';

/**
 * Module dependencies.
 */
var googleapis = require('googleapis'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    config = require('../../config/config');
    
/**
 * Login a user from its google id.
 * 
 * @param id a google profile id
 * @param req current request
 * @param res response to the current request 
 */
var login = function(id, req, res) {
	// Search the user
	User.findOne({
		'google.id': id
	}, function(err, user) {
		if (!user) {
			res.send({error: 'access denied'});
		} else {
			// save the userid in the session
			req.session.userid = user._id;
			res.send({
				id: user.google.id,
                googleDisplayName: user.google.name,
                googlePublicProfileUrl: user.google.link,
                googlePublicProfilePhotoUrl: user.google.picture
			});
		}
	});
};

/**
 * Verify that the token in the given credential is valid.
 *
 * @param access_token The token to verify.
 * @param callback than gives an id and an error
 */
var verifyToken = function(access_token, callback) {
	googleapis.discover('oauth2', 'v2').execute(function(err, client) {
        var params = { 'access_token':  access_token};
        var req1 = client.oauth2.tokeninfo(params);
        req1.execute(function (err, response) {
            // If there was an error in the token info, abort.
            if (err || response.error) {
                callback(null, err || response.error);
            } else {
                var p = new RegExp('(\\d+)([-]?)(.*)$');
                var issuedTo = p.exec(config.google.clientID);
                var localId = p.exec(response.issued_to);
                
                // Make sure the token we got is for our app.
                if (issuedTo !== null && localId !== null && issuedTo[1] === (localId[1])) {
                    callback(response.user_id, null);
                } else {
                    callback(null, 'Token\'s client ID does not match app\'s.');
                }
            }
        });
    });
};

/**
 * Auth callback
 */
exports.connect = function(req, res) {
    // Get the access token
    var access_token = req.body.access_token;
    
    // Verify that the access token is provided
    if (!access_token) {
		res.status(400).send('Missing access token in request.');
    } else {
        // Verify that the access token is linked to an existing account
        // and login the user.
        verifyToken(access_token, function(id, err) {
            if (err) {
                console.log('Error: ' + err);
            } else {
                console.log('Client ID: ' + id);
                login(id, req, res);
            }
        });
    }
};