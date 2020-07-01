/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const Item = mongoose.model('Item');

let userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher', 'student'],
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    recoverPasswordToken: String,
    recoverPasswordExpires: Date,
    inventory: {
        type: [{
            item: { type: Schema.ObjectId, ref: 'Item' }
        }],
        required: true
    },
    currency: {
        type: Number,
    },
    milestones: {
        type: [Number],
        required: true
    },
    class: {
        type: [{
            item: { type: Schema.ObjectId, ref: 'Class' }
        }],
    },
    avatar: {
        type: {
            hair1:      Schema.ObjectId, ref: 'Item', 
            body:       Schema.ObjectId, ref: 'Item', required: true,
            pants:      Schema.ObjectId, ref: 'Item', required: true,
            shirt:      Schema.ObjectId, ref: 'Item', required: true,
            shoes:      Schema.ObjectId, ref: 'Item',
            glasses:    Schema.ObjectId, ref: 'Item',
            hair2:      Schema.ObjectId, ref: 'Item',
            hat:        Schema.ObjectId, ref: 'Item',
            medal:      Schema.ObjectId, ref: 'Item'
        },
        required: false
    },
    recentMilestones: {
        type: [String],
        required: true
    },
    bubbleInit: {
        type: Boolean,
        required: true
    },
    labyrinthAnswers: {
        type: [Number],
    },
    bubble: {
        type: {
            online:     [Number],
            social:     [Number],
            mainstream: [Number],

            category1:  [Number],
            category2:  [Number],

            knowledge:  [Number],

            techSavvy:  [Number],
        },
        required: true
    },
});

// Method to set a hashed password for a user.
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to validate a password for a user.
userSchema.methods.validatePassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

// Method to generate a token based on the id, role, email and the secret.
userSchema.methods.generateJwt = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        role: this.role,
        exp: Date.now() + (86400 * 1000)
    }, process.env.MY_SECRET);
};

module.exports = mongoose.model('User', userSchema);

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */