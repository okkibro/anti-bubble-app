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
        item: {type: Schema.ObjectId, ref: 'Item'}
        }],
        required: true
    },
    currency: {
        type: Number,
    milestones: {
        type: [Number],
        required: true
    }
    class: String
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        role: this.role,
        exp: Date.now() + (86400 * 1000)
    }, process.env.MY_SECRET);
};

module.exports = mongoose.model('User', userSchema);