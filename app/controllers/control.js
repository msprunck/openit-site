'use strict';

/**
 * Module dependencies.
 */

/**
 * Find device by id
 */
exports.command = function(req, res) {
    var client = exports.client;
    var channel = '/control/' + req.params.deviceId;
    var data = {
    	command: req.params.command,
    	body: req.body
    }
    client.publish(channel, data);
    console.log('Publish to channel: ' + channel);
    res.jsonp({result: 'OK'});
};

exports.setClient = function(client) {
	exports.client = client;
};