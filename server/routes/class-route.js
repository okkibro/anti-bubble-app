/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const jwt = require('express-jwt');
const Users = mongoose.model('users');
const Classes = mongoose.model('classes');

// Small constant for authentication.
const auth = jwt({
	secret: process.env.MY_SECRET,
	userProperty: 'payload',
});

/** POST method to create a new class in the database. */
router.post('/createClass', auth, (req, res) => {

	// Check user is authorized to perform te action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		// Make a new class.
		let klas = new Classes();

		// Fill in (the required) data to classes attributes.
		klas.code = sanitize(req.body.classes.code);
		klas.level = sanitize(req.body.classes.level);
		klas.year = sanitize(req.body.classes.year);
		klas.title = sanitize(req.body.classes.title);
		klas.teacher = sanitize(req.body.teacher);
		klas.students = [];

		// Save the changes to the database.
		klas.save().then(() => {
			return res.status(200).json({ code: klas.code, id: klas._id });
		}).catch((err) => {
			return res.status(400).json({ message: err });
		});
	}
});

/** POST method to join a user to a class. */
router.post('/joinClass', auth, (req, res) => {

	// Check user is authorized to perform te action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Users.findById(req.payload._id, (err, user) => {
			if (err) {
				return res.status(200).json({ succes: false, message: err });
			} else {
				Classes.findOne({ code: req.body.code }, (err, foundClass) => {

					// Check the code corresponds with an existing.
					if (!foundClass) {
						return res.status(200).json({ succes: false, message: 'Geen klas gevonden met de gegeven code, controleer de code en probeer het opnieuw.', err: err });
					} else {

						// Check if your role is a student. (students can only be in one class!).
						if (user.role === 'student') {
							if (user.classArray.length <= 0) {
								if (foundClass.students.find((x) => x._id === req.payload._id) !== undefined) {
									return res.status(200).json({ succes: false, message: 'Je zit al in klas: ' + foundClass.title });
								} else {
									foundClass.students.push(user);
									foundClass.save().catch((err) => {
										return res.status(400).json({ message: err });
									});
									user.classArray.push(foundClass);
									user.save().catch((err) => {
										return res.status(400).json({ message: err });
									});
									return res.status(200).json({ succes: true, message: `Leerling is succesvol toegevoegd aan de klas ${foundClass.title}` });
								}
							}

							// Teacher can be the teacher of multiple classes.
						} else {
							user.classArray.push(foundClass);
							user.save().then(() => {
								return res.status(200).json({ succes: true, message: `Docent is succesvol toegevoegd aan de klas ${foundClass.title}` });
							}).catch((err) => {
								return res.status(200).json({ succes: false, message: err });
							});
						}
					}
				});
			}
		});
	}
});

/** GET method to get the class a user is in.
 * In case of a teacher this functions gives back the first class in the teachers class list. */
router.get('/getClass', auth, (req, res) => {

	// Check user is authorized to perform te action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Users.findById(req.payload._id, async (err, user) => {
			if (err) {
				return res.status(200).json({ succes: false, message: err });
			} else {
				if (user.classArray[0]) {
					Classes.findById(user.classArray[0], (err, foundClass) => {
						let numberOfMembers = foundClass.students.length;

						// Check if there are students in this class.
						if (numberOfMembers > 0) {
							let classmates = [];
							for (let student of foundClass.students) {
								Users.findById(student._id, (error, classmate) => {
									classmates.push(classmate);

									// Check if all classmates are pushed to the list.
									if (classmates.length === numberOfMembers) {
										return res.status(200).json({ succes: true, class: foundClass, classmates: classmates });
									}
								});
							}
						} else {
							return res.status(200).json({ succes: true, class: foundClass, classmates: [] });
						}
					});
				} else {
					return res.status(200).json({ succes: false });
				}
			}
		});
	}
});

/** GET method to get all the database class ids a user has in their class list. */
router.get('/getClassIds', auth, (req, res) => {

	// Check user is authorized to perform te action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Users.findById(req.payload._id, (err, user) => {
			if (err) {
				return res.status(200).json({ succes: false, message: err });
			} else {
				return res.status(200).json({ classIds: user.classArray });
			}
		});
	}
});

/** GET method to get a class based on the given id in the url. */
router.get('/getSingleClass/:id', auth, (req, res) => {

	// Check user is authorized to perform te action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Classes.findById(req.params.id, (err, foundClass) => {
			if (!err) {
				let numberOfMembers = foundClass.students.length;

				// Check if there are students in this class.
				if (numberOfMembers > 0) {
					let classmates = [];
					for (student of foundClass.students) {
						Users.findById(student._id, (error, classmate) => {
							classmates.push(classmate);

							// Check if all classmates are pushed to the list.
							if (classmates.length === numberOfMembers) {
								return res.status(200).json({ succes: true, class: foundClass, classmates: classmates });
							}
						});
					}
				} else {
					return res.status(200).json({ succes: true, class: foundClass, classmates: [] });
				}
			} else {
				return res.status(200).json({ succes: false, message: err });
			}
		});
	}
});

/** GET method to get a profile of a user in your class. */
router.get('/classmateProfile/:id', auth, (req, res) => {

	// Check user is authorized to perform te action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: private profile' });
	} else {
		Users.findById(req.payload._id, (errorU, user) => {
			if (!errorU) {
				Users.findById(req.params.id, (errorC, classmate) => {
					if (!errorC) {
						if (user.role === 'student') {

							// Check if the classmate is actually in the same class.
							let userId = user.classArray[0]._id.toString();
							let classmateId = classmate.classArray[0]._id.toString();
							if (userId !== classmateId) {
								return res.status(401).json({ message: "Not authorized to see user's profile" });
							} else {
								return res.status(200).json(classmate);
							}
						} else {
							return res.status(200).json(classmate);
						}
					} else {
						return res.status(404).json({ message: "Classmate's profile not found" });
					}
				});
			} else {
				return res.status(404).json({ message: "User's profile not found" });
			}
		});
	}
});

/** DELETE method for deleting a class based on a given id. */
router.delete('/deleteClass/:id', auth, (req, res) => {

	// Check user is authorized to perform te action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Find class based on id passed in URL.
		Classes.findById(req.params.id, (err, klas) => {

			// If we found a class in the database with said id delete it and continue.
			if (!err && klas != null) {
				Classes.findByIdAndDelete({_id: klas._id}).exec();

				// Update 'classArray' of all users that were apart of the class so they will not be members of a deleted class.
				// We don't check for length of 'students' array since the class will always have atleast 1 memmber, namely the teacher.
				Users.find({ 'classArray._id': klas._id }, (err, classMembers) => {
					if (!err && classMembers != null) {
						for (let classMember of classMembers) {
							Users.findByIdAndUpdate({ _id: classMember._id }, { $pull: { classArray: { _id: klas._id }}}).exec();
							classMember.save();
						}
					} else {
						return res.status(404).json({ succes: false, message: err });
					}
				});
				return res.status(200).json({ succes: true, message: 'Klas is succesvol verwijderd.' });
			} else {
				return res.status(404).json({ succes: false, message: err });
			}
		});
	}
});

/** PATCH that removes a student from a class (whether initiated by the teacher or the student themselves). */
router.patch('/leaveClass', auth, (req, res) => {

	// Check user is authorized to perform te action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: private profile' });
	} else {

		// Find the user who is leaving/being removed from the class and update their 'classArray'.
		Users.findById(req.body.userId, (err, user) => {
			Classes.findById(req.body.classId, (err, klas) => {
				if (!err && user != null && klas != null) {
					Users.findByIdAndUpdate({_id: user._id}, {$pull: {classArray: {_id: req.body.classId}}}).exec();
					user.save();
					Classes.findByIdAndUpdate({_id: klas._id}, {$pull: {students: {_id: req.body.userId}}}).exec();
					klas.save();
				} else {
					return res.status(404).json({succes: false, message: err});
				}
			});
		});

		// If 'req.body.leaving' is true, the student left themselves; if it is false, they were kicked by a teacher and we
		// return the message accrodingly.
		if (req.body.leaving) {
			return res.status(200).json({ succes: true, message: 'Je hebt de klas succesvol verlaten.' });
		} else {
			return res.status(200).json({ succes: true, message: 'Leerling is succesvol uit de klas verwijderd.' });
		}
	}
});

module.exports = router;
