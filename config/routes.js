'use strict';

var cache = require('./middlewares/cache').cache;

module.exports = function(app, passport, auth, bayeux) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/users', users.create);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/oauth2callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Device Routes
    var devices = require('../app/controllers/devices');
    app.get('/devices', auth.requiresLogin, devices.all);
    app.post('/devices', auth.requiresLogin, devices.create);
    app.get('/devices/:deviceId', devices.show);
    app.put('/devices/:deviceId', auth.requiresLogin, auth.device.hasAuthorization, devices.update);
    app.del('/devices/:deviceId', auth.requiresLogin, auth.device.hasAuthorization, devices.destroy);
    
    // API Routes
    var api = require('../app/controllers/api');
    app.post('/api/connect', api.connect);
    app.get('/api/devices', cache(3600), devices.all);
    app.get('/api/devices/:deviceId/commands', cache(3600), devices.commands);
    
    //Control routes
	var control = require('../app/controllers/control');
	control.setClient(bayeux.getClient());
	app.post('/api/control/:deviceId/:command', /*auth.requiresLogin, auth.device.hasAuthorization,*/ control.command)
	
    //Finish with setting up the deviceId param
    app.param('deviceId', devices.device);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
