'use strict';

/**
 * Module dependencies.
 */

/**
 * Find device by id
 */
exports.command = function(req, res) {
    var client = exports.client;
    var channel = '/control/' + req.params.deviceId + '/' + req.params.command;
    client.publish(channel, req.body);
    console.log('Publish to channel: ' + channel);
    res.jsonp({result: 'OK'});
};

exports.setClient = function(client) {
	exports.client = client;
};