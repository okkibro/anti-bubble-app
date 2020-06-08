const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const Classes = mongoose.model('Classes');
const sanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('express-jwt');

const auth = jwt({
	secret: process.env.MY_SECRET,
	userProperty: 'payload',
});

//Post function to create a new class in the database
router.post('/createClass', auth, (req, res) => {
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		//make a new class
		let classes = new Classes();
		//fill in data to classes attributes
		classes.code = sanitize(req.body.classes.code);
		classes.level = sanitize(req.body.classes.level);
		classes.year = sanitize(req.body.classes.year);
		classes.title = sanitize(req.body.classes.title);
		classes.teacher = sanitize(req.body.teacher);
		classes.students = [];
		//save the changes to the database
		classes
			.save()
			.then(() => {
				console.log('saved class');
				res.status(200).json(classes.code);
			})
			.catch((err) => {
				res.status(400).send(err);
			});
	}
});

// Post function to join a user to a class
router.post('/joinClass', auth, (req, res) => {
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		User.findById(req.payload._id, (err, user) => {
			if (err) {
				console.log(err);
				res.status(200).json({ succes: false, message: err });
			} else {
				Classes.findOne({ code: req.body.code }, (err, foundClass) => {
					if (!foundClass) {
						res.json({
							succes: false,
							message: 'Geen klas gevonden met de gegeven code',
						});
					} else {
						if (user.role == 'student') {
							if (user.class.length <= 0) {
								if (foundClass.students.find((x) => x._id == req.payload._id) != undefined) {
									res.status(200).json({ succes: false, message: 'Je zit al in klas: ' + foundClass.title });
								} else {
									foundClass.students.push(user);
									foundClass.save().catch((err) => {
										res.status(400).send(err);
									});
									user.class.push(foundClass);
									user.save().catch((err) => {
										res.status(400).send(err);
									});
									res.status(200).json({ succes: true, message: `Leerling is succesvol toegevoegd aan de klas ${foundClass.title}` });
								}
							}
						} else {
							user.class.push(foundClass);
							user.save().then(() => {
								res.status(200).json({ succes: true, message: `Docent is succesvol toegevoegd aan de klas ${foundClass.title}` });
							}).catch((err) => {
								res.status(400).send(err);
							});
						}
					}
				});
			}
		});
	}
});

// Get function to get the class a user is in
router.get('/getClass', auth, (req, res) => {
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		User.findById(req.payload._id, async (err, user) => {
			if (err) {
				console.log(err);
				res.status(200).json({ succes: false, message: err });
			} else {
				classmates = [];
				if (user.class[0]) {
					Classes.findById(user.class[0], (err, foundClass) => {
						numberOfMembers = foundClass.students.length;
						if (numberOfMembers > 0) {
							for (student of foundClass.students) {
								User.findById(student._id, (error, classmate) => {
									classmates.push(classmate);
									if (classmates.length == numberOfMembers) {
										res.status(200).json({ succes: true, class: foundClass, classmates: classmates });
									}
								});
							}
						} else {
							res.status(200).json({ succes: true, class: foundClass, classmates: classmates });
						}
					});
				} else {
					res.status(200).json({ succes: false });
				}
			}
		});
	}
});

router.get('/getClassIds', auth, (req, res) => {
	User.findById(req.payload._id, async (err, user) => {
		if (err) {
			console.log(err);
			res.status(200).json({ succes: false, message: err });
		} else {
			res.status(200).json({ classIds: user.class });
		}
	});
});

router.get('/getSingleClass/:id', auth, (req, res) => {
	classmates = [];
	Classes.findById(req.params.id, (error, foundClass) => {
		if (foundClass) {
			numberOfMembers = foundClass.students.length;
			if (numberOfMembers > 0) {
				for (student of foundClass.students) {
					User.findById(student._id, (error, classmate) => {
						classmates.push(classmate);
						if (classmates.length == numberOfMembers) {
							res.status(200).json({ succes: true, class: foundClass, classmates: classmates });
						}
					});
				}
			} else {
				res.status(200).json({ succes: true, class: foundClass, classmates: [] });
			}
		} else {
			res.status(200).json({succes: false});
		}
	});
});

router.get('/classmateProfile/:id', auth, (req, res) => {
	// If no user ID exists in the JWT return a 401
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		// Otherwise continue and find own and classmate's profile
		User.findById(req.payload._id, (error, user) => {
			User.findById(req.params.id, (error, classmate) => {
				if (!classmate) {
					res.status(404).json({
						message: "User's profile not found",
					});
				} else if (user.role == 'student') {
					//Check if classmate is actually in the same class
					userId = user.class[0]._id.toString();
					classmateId = classmate.class[0]._id.toString();
					if (userId != classmateId) {
						res.status(401).json({
							message: "Not authorized to see user's profile",
						});
					} else {
						res.status(200).json(classmate);
					}
				} else {
					res.status(200).json(classmate);
				}
			});
		});
	}
});

module.exports = router;
