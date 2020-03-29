const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// TODO: Check use of mongoose-unique-validator

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
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

// TODO: Remove secret from code
userSchema.methods.generateJwt = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: Date.now() + (86400 * 1000)
    }, "longer-secret-is-better");
};

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);