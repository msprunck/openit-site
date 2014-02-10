'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');


/**
 * Device Schema
 */
var DeviceSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    key: {
        type: String,
        default: uuid.v4,
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    commands: [{
        name: {
            type: String,
            default: '',
            trim: true,
            required: true
        },
        voice: {
            type: String,
            default: '',
            trim: true,
            required: true
        }
    }]
});

/**
 * Validations
 */
DeviceSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
DeviceSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

DeviceSchema.statics.loadByKey = function(key, cb) {
    this.findOne({
        'key': key
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Device', DeviceSchema);
