/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Classes = mongoose.model('Classes');
const sanitize = require('mongo-sanitize');
const jwt = require('express-jwt');

// Small constant to check authentication.
const auth = jwt({
	secret: process.env.MY_SECRET,
	userProperty: 'payload',
});

/** Post method to create a new class in the database. */
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
			res.status(200).json({ code: classes.code, id: classes._id });
		}).catch((err) => {
			res.status(400).json({ message: err });
		});
	}
});

/** Post method to join a user to a class. */
router.post('/joinClass', auth, (req, res) => {

	// Check if you are authorized.
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		User.findById(req.payload._id, (err, user) => {
			if (err) {
				res.status(200).json({ succes: false, message: err });
			} else {
				Classes.findOne({ code: req.body.code }, (err, foundClass) => {

					// Check the code corresponds with an existing.
					if (!foundClass) {
						res.status(200).json({ succes: false, message: 'Geen klas gevonden met de gegeven code', err: err });
					} else {

						// Check if your role is a student. (students can only be in one class!).
						if (user.role === 'student') {
							if (user.classArray.length <= 0) {
								if (foundClass.students.find((x) => x._id === req.payload._id) !== undefined) {
									res.status(200).json({ succes: false, message: 'Je zit al in klas: ' + foundClass.title });
								} else {
									foundClass.students.push(user);
									foundClass.save().catch((err) => {
										res.status(400).json({ message: err });
									});
									user.classArray.push(foundClass);
									user.save().catch((err) => {
										res.status(400).json({ message: err });
									});
									res.status(200).json({ succes: true, message: `Leerling is succesvol toegevoegd aan de klas ${foundClass.title}` });
								}
							}

							// Teacher can be the teacher of multiple classes.
						} else {
							user.classArray.push(foundClass);
							user.save().then(() => {
								res.status(200).json({ succes: true, message: `Docent is succesvol toegevoegd aan de klas ${foundClass.title}` });
							}).catch((err) => {
								res.status(200).json({ succes: false, message: err });
							});
						}
					}
				});
			}
		});
	}
});

/** Get method to get the class a user is in.
 * In case of a teacher this functions gives back the first class in the teachers class list. */
router.get('/getClass', auth, (req, res) => {
	// Check if you are authorized.
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		User.findById(req.payload._id, async (err, user) => {
			if (err) {
				res.status(200).json({ succes: false, message: err });
			} else {
				if (user.classArray[0]) {
					Classes.findById(user.classArray[0], (err, foundClass) => {
						let numberOfMembers = foundClass.students.length;

						// Check if there are students in this class.
						if (numberOfMembers > 0) {
							let classmates = [];
							for (let student of foundClass.students) {
								User.findById(student._id, (error, classmate) => {
									classmates.push(classmate);

									// Check if all classmates are pushed to the list.
									if (classmates.length === numberOfMembers) {
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

/** Get method to get all the database class ids a user has in their class list. */
router.get('/getClassIds', auth, (req, res) => {
	//Check if you are authorized.
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		User.findById(req.payload._id, (err, user) => {
			if (err) {
				res.status(200).json({ succes: false, message: err });
			} else {
				res.status(200).json({ classIds: user.classArray });
			}
		});
	}
});

/** Get method to get a class based on the given id in the url. */
router.get('/getSingleClass/:id', auth, (req, res) => {
	// Check if you are authorized.
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		Classes.findById(req.params.id, (err, foundClass) => {
			if (!err) {
				let numberOfMembers = foundClass.students.length;

				// Check if there are students in this class.
				if (numberOfMembers > 0) {
					let classmates = [];
					for (student of foundClass.students) {
						User.findById(student._id, (error, classmate) => {
							classmates.push(classmate);

							// Check if all classmates are pushed to the list.
							if (classmates.length === numberOfMembers) {
								res.status(200).json({ succes: true, class: foundClass, classmates: classmates });
							}
						});
					}
				} else {
					res.status(200).json({ succes: true, class: foundClass, classmates: [] });
				}
			} else {
				res.status(200).json({ succes: false, message: err });
			}
		});
	}
});

/** Get method to get a profile of a user in your class. */
router.get('/classmateProfile/:id', auth, (req, res) => {

	// Check if you are authorized.
	if (!req.payload._id) {
		res.status(401).json({
			message: 'UnauthorizedError: private profile',
		});
	} else {
		User.findById(req.payload._id, (errorU, user) => {
			if (!errorU) {
				User.findById(req.params.id, (errorC, classmate) => {
					if (!errorC) {
						if (user.role === 'student') {

							// Check if the classmate is actually in the same class.
							let userId = user.classArray[0]._id.toString();
							let classmateId = classmate.classArray[0]._id.toString();
							if (userId !== classmateId) {
								res.status(401).json({ message: "Not authorized to see user's profile" });
							} else {
								res.status(200).json(classmate);
							}
						} else {
							res.status(200).json(classmate);
						}
					} else {
						res.status(404).json({ message: "Classmate's profile not found" });
					}
				});
			} else {
				res.status(404).json({ message: "User's profile not found" });
			}
		});
	}
});

/** Delete method for deleting a class based on a given id. */
router.delete('/deleteClass/:id', auth, (req, res) => {

	// Find class based on id pased in URL.
	Classes.findById(req.params.id, (err, klas) => {

		// If we found a class in the database with said id delete it and continue.
		if (!err && klas != null) {
			Classes.findByIdAndDelete({ _id: klas._id }).exec();

			// Update 'classArray' of all users that were apart of the class so they will not be members of a deleted class.
			// We don't check for length of 'students' array since the class will always have atleast 1 memmber, namely the teacher.
			User.find({'classArray._id': klas._id}, (err, classMembers) => {
				if (!err && classMembers != null) {
					for (let classMember of classMembers) {
						User.findByIdAndUpdate({ _id: classMember._id }, { $pull: { classArray: { _id: klas._id }}}).exec();
						classMember.save();
					}
				} else {
					res.status(404).json({ succes: false, message: err });
				}
			});
			res.status(200).json({ succes: true, message: 'Klas is succesvol verwijderd.' });
		} else {
			res.status(404).json({ succes: false, message: err });
		}
	});
});

module.exports = router;
