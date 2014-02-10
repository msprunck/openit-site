'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
    Device = mongoose.model('Device'),
    util = require('util');
    
module.exports = function(bayeux, db) {
	bayeux.on('subscribe', function(clientId, channel) {
  		console.log("Client " + clientId + " subscribed to channel " + channel);
	});
	
	bayeux.addExtension({
	  incoming: function(message, callback) {
		// Let non-subscribe messages through
		if (message.channel === '/meta/subscribe') {
			checkSubscription(message, callback);
		} else {
			return callback(message);
		}
	  }
	});
	
	/** Check that the subscription is allowed. The given key shall match with the
	  subscription url (deviceId, command)*/
	var checkSubscription = function(message, callback) {
  		// see http://faye.jcoglan.com/node/extensions.html
  		Device.loadByKey(message.ext.authToken, function(err, device) {
  			var regExp = /\/control\/(.*)/g;
  			var match = regExp.exec(message.subscription);
  			
  			if (match && 
  				match[1] == device._id) {
  				// Subscription allowed
  			} else {
  				message.error = '403::Authentication failed for this device or command';
  			}
  			callback(message);
  		});
	};
};