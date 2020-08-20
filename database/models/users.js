/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

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
			item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' }
		}],
		required: true
	},
	currency: {
		type: Number
	},
	milestones: {
		type: [Number],
		required: true
	},
	classArray: {
		type: [{
			item: { type: mongoose.Schema.Types.ObjectId, ref: 'classes' }
		}]
	},
	avatar: {
		type: {
			hair1: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
			body: { type: mongoose.Schema.Types.ObjectId, ref: 'items', required: true },
			pants: { type: mongoose.Schema.Types.ObjectId, ref: 'items', required: true },
			shirt: { type: mongoose.Schema.Types.ObjectId, ref: 'items', required: true },
			shoes: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
			glasses: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
			hair2: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
			hat: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
			medal: { type: mongoose.Schema.Types.ObjectId, ref: 'items' }
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
		type: [Number]
	},
	bubble: {
		type: {
			online: [Number],
			social: [Number],
			mainstream: [Number],
			category1: [Number],
			category2: [Number],
			knowledge: [Number],
			techSavvy: [Number]
		},
		required: true
	}
});

// Method to set a hashed password for a user.
userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to validate a password for a user.
userSchema.methods.validatePassword = function (password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
};

// Method to generate a token based on the id, role, email and the secret.
userSchema.methods.generateJwt = function () {
	return jwt.sign({
		_id: this._id,
		email: this.email,
		role: this.role,
		exp: Date.now() + (86400 * 1000)
	}, process.env.MY_SECRET);
};

module.exports = mongoose.model('users', userSchema);