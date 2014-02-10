'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Device = mongoose.model('Device'),
    _ = require('lodash');


/**
 * Find device by id
 */
exports.device = function(req, res, next, id) {
    Device.load(id, function(err, device) {
        if (err) return next(err);
        if (!device) return next(new Error('Failed to load device ' + id));
        req.device = device;
        next();
    });
};

/**
 * Create a device
 */
exports.create = function(req, res) {
    var device = new Device(req.body);
    device.user = req.user;

    device.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                device: device
            });
        } else {
            res.jsonp(device);
        }
    });
};

/**
 * Update a device
 */
exports.update = function(req, res) {
    var device = req.device;

    device = _.extend(device, req.body);

    device.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                device: device
            });
        } else {
            res.jsonp(device);
        }
    });
};

/**
 * Delete a device
 */
exports.destroy = function(req, res) {
    var device = req.device;

    device.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                device: device
            });
        } else {
            res.jsonp(device);
        }
    });
};

/**
 * Show a device
 */
exports.show = function(req, res) {
    res.jsonp(req.device);
};

/**
 * List of devices
 */
exports.all = function(req, res) {
    var userid;
    if (req.user) {
        userid = req.user._id;
    } else {
        userid = req.session.userid;
    }
    var query = { user: userid };
    //console.log(query);
    //var query = {};
    Device.find(query).sort('-name').populate('user', 'name username').exec(function(err, devices) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(devices);
        }
    });
};

exports.commands = function(req, res) {
	res.jsonp(req.device.commands);
};