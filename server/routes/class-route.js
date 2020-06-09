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

// Small constant to check authentication.
const auth = jwt({
	secret: process.env.MY_SECRET,
	userProperty: 'payload',
});

//TODO: CHECK ALL STATUS CODES TO BETTER FIT THE HTTP STATUS PROTOCOL GUIDLINES

// Post method to create a new class in the database.
router.post('/createClass', auth, (req, res) => {
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		// Make a new class.
		let classes = new Classes();
		// Fill in (the required) data to classes attributes.
		classes.code = sanitize(req.body.classes.code);
		classes.level = sanitize(req.body.classes.level);
		classes.year = sanitize(req.body.classes.year);
		classes.title = sanitize(req.body.classes.title);
		classes.teacher = sanitize(req.body.teacher);
		classes.students = [];
		// Save the changes to the database.
		classes.save().then(() => {
			console.log('saved class');
			res.status(200).json(classes.code);
		}).catch((err) => {
			res.status(400).send(err);
		});
	}
});

// Post method to join a user to a class.
router.post('/joinClass', auth, (req, res) => {
	// Check if you are authorized.
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
					// Check the code corresponds with an existing.
					if (!foundClass) {
						res.status(200).json({succes: false, message: 'Geen klas gevonden met de gegeven code', err: err});
					} else {
						// Check if your role is a student. (students can only be in one class!).
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
							// Teacher can be the teacher of multiple classes.
							user.class.push(foundClass);
							user.save().then(() => {
								res.status(200).json({ succes: true, message: `Docent is succesvol toegevoegd aan de klas ${foundClass.title}` });
							}).catch((err) => {
								console.log(err);
								res.status(200).json({ succes: false, message: err });
							});
						}
					}
				});
			}
		});
	}
});

// Get method to get the class a user is in.
// 		(In case of a teacher this functions gives back the first class in the teachers class list.)
router.get('/getClass', auth, (req, res) => {
	// Check if you are authorized.
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
				if (user.class[0]) {
					Classes.findById(user.class[0], (err, foundClass) => {
						numberOfMembers = foundClass.students.length;
						// Check if there are students in this class.
						if (numberOfMembers > 0) {
							classmates = [];
							for (student of foundClass.students) {
								User.findById(student._id, (error, classmate) => {
									classmates.push(classmate);
									// Check if all classmates are pushed to the list.
									if (classmates.length == numberOfMembers) {
										res.status(200).json({ succes: true, class: foundClass, classmates: classmates });
									}
								});
							}
						} else {
							res.status(200).json({ succes: true, class: foundClass, classmates: [] });
						}
					});
				} else {
					res.status(200).json({ succes: false });
				}
			}
		});
	}
});

// Get method to get all the database class ids a user has in their class list.
router.get('/getClassIds', auth, (req, res) => {
	// Check if you are authorized.
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
				res.status(200).json({ classIds: user.class });
			}
		});
	}
});

// Get method to get a class based on the given id in the url.
router.get('/getSingleClass/:id', auth, (req, res) => {
	// Check if you are authorized.
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		Classes.findById(req.params.id, (err, foundClass) => {
			if (!err) {
				numberOfMembers = foundClass.students.length;
				// Check if there are students in this class.
				if (numberOfMembers > 0) {
					classmates = [];
					for (student of foundClass.students) {
						User.findById(student._id, (error, classmate) => {
							classmates.push(classmate);
							// Check if all classmates are pushed to the list.
							if (classmates.length == numberOfMembers) {
								res.status(200).json({ succes: true, class: foundClass, classmates: classmates });
							}
						});
					}
				} else {
					res.status(200).json({ succes: true, class: foundClass, classmates: [] });
				}
			} else {
				console.log(err);
				res.status(200).json({succes: false, message: err});
			}
		});
	}
});

// Get method to get a profile of a user in your class.
router.get('/classmateProfile/:id', auth, (req, res) => {
	// Check if you are authorized.
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		User.findById(req.payload._id, (error, user) => {
			User.findById(req.params.id, (error, classmate) => {
				// Check if the requested classmate exists.
				if (!classmate) {
					res.status(404).json({message: "User's profile not found"});
				} else if (user.role == 'student') {
					// Check if the classmate is actually in the same class.
					userId = user.class[0]._id.toString();
					classmateId = classmate.class[0]._id.toString();
					if (userId != classmateId) {
						res.status(401).json({message: "Not authorized to see user's profile"});
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
