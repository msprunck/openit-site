'use strict';

var headerKey = 'Cache-Control';
var noCacheKey = 'no-cache';
var maxAgeKey = 'max-age';

/**
 * Add Cache-Control to the response header.
 */
exports.cache = function (seconds) {
    return function (req, res, next) {
        if (seconds === 0) {
            res.header(headerKey, noCacheKey);
        } else {
            res.header(headerKey, maxAgeKey + "=" + seconds);
        }
        next();
    }
}