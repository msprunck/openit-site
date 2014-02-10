'use strict';

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

/**
 * Device authorizations routing middleware
 */
exports.device = {
    hasAuthorization: function(req, res, next) {
        if (req.device.user.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};