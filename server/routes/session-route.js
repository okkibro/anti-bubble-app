/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const Activities = mongoose.model('activities');
const Users = mongoose.model('users');
const Questions = mongoose.model('questions');
const Articles = mongoose.model('articles');
const Logs = mongoose.model('logs');
const Classes = mongoose.model('classes');
const jwt = require('express-jwt');

// Small constant for authentication.
const auth = jwt({
	secret: process.env.MY_SECRET,
	userProperty: 'payload'
});

/**
 * GET method to get the articles from the database.
 */
router.get('/articles', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get the logged in user.
		Users.findById(req.payload._id, (err, user) => {
			if (!err && user != null) {
				Articles.find({}, (err, articles) => {

					// Send all article data from the database.
					return res.status(200).json(articles);
				});
			} else {
				return res.status(404).json({ succes: false });
			}
		});
	}
});

/**
 * POST method to return a given activity from the database.
 */
router.post('/activity', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Users.findById(req.payload._id, (err, user) => {

			// Get the logged in user.
			if (user.role === 'student') {

				// Only teachers can send requests to get activities.
				return res.status(401).json({ message: 'UnauthorizedError: Not a teacher' });
			} else {
				Activities.findOne({ name: req.body.activity }, (err, activity) => {

					// Find activity in database based on the name sent in the body.
					// Send the activity object returned by the findOne function.
					return res.status(200).json(activity);
				});
			}
		});
	}
});

/**
 * GET method to get all the activities from the database.
 */
router.get('/activities', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Activities.find({}, (err, activities) => {
			if (!err) {
				// Send all activities found in the database to the user.
				return res.status(200).json({ succes: true, activities: activities });
			} else {
				return res.status(500).json({ succes: false, message: err });
			}
		});
	}
});

/**
 * PATCH method to change the bubbleInit value to true if a user has completed the initial maze.
 */
router.patch('/updateBubbleInit', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get the logged in user.
		Users.findById(req.payload._id).then((user) => {

			// Set bubbleInit to true and save the schema.
			user.bubbleInit = true;
			user.save().then(() => {
				return res.status(200).json({ succes: true });
			}).catch((err) => {
				return res.status(500).json({ message: err });
			});
		});
	}
});

/**
 * POST method to get the array of questions based on the part given in the body of the request.
 */
router.post('/questions', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Questions.find({ part: req.body.part }, (err, questions) => {
			if (!err) {
				return res.status(200).json(questions);
			} else {
				return res.status(404).json({ message: err });
			}
		});
	}
});

/**
 * POST method to save answers to the logged in user.
 */
router.post('/labyrinthAnswers', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get the logged in user.
		Users.findById(req.payload._id, (err, user) => {

			// Loop over all questions and save corresponding answers to the user's answers based on the index of the question.
			for (let i = 1; i < req.body.answers.length; i++) {
				let questionID = req.body.answers[i].question.id;
				user.labyrinthAnswers[questionID] = req.body.answers[i].answer;
			}
			user.markModified('labyrinthAnswers');

			// Save the result.
			user.save().then(() => {
				return res.status(200).json({ succes: true });
			}).catch((err) => {
				return res.status(500).json({ succes: false, message: err });
			});
		});
	}
});

/**
 * POST method to change currency amount for the logged in user.
 */
router.post('/earnMoney', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get logged in user.
		Users.findById(req.payload._id, (err, user) => {

			// Increase currency.
			user.currency += req.body.money;
			user.save().then(() => {
				return res.status(200).json({ succes: true });
			}).catch((err) => {
				return res.status(500).json({ succes: false, message: err });
			});
		});
	}
});

/**
 * POST method to record data about a session that has ended.
 */
router.post('/recordSession', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Make a new session log and fill it with the proper request data and afterwards
		// store it in the database.
		let log = new Logs();
		let data = req.body.sessionData;
		log.activity = data.activity;
		log.answers = [];
		for (let answer of data.answers) {
			log.answers.push(sanitize(answer));
		}
		log.class = data.class;
		log.questions = [];
		for (let question of data.questions) {
			log.questions.push(sanitize(question));
		}
		log.students = [];
		for (let studentEmail of data.students) {
			Users.findOne({ email: studentEmail }, (err, user) => {
				if (!err && user != null) {
					log.students.push(user);
				} else {
					return res.status(404).json({ succes: false });
				}
			});
		}
		log.user = data.user;
		log.save().then(() => {
			return res.status(200).json({ succes: true });
		}).catch((err) => {
			return res.status(500).json({ succes: false, message: err });
		});
	}
});

/**
 * GET method to get session logs from the database based on user specified filters.
 */
router.get('/getLogs', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id || req.payload.role !== 'teacher') {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get teacher requesting logs.
		Users.findById(req.payload._id, (err, user) => {
			if (!err && user != null) {

				// Get all the classes of the teacher.
				Classes.find({ teacher: user._id }, (err, classes) => {

					// Early exit if the teacher doesn't have any classes, otherwise continue.
					if (classes.length === 0) {
						return res.status(200).json({
							succes: true,
							logs: [],
							classes: [],
							students: []
						});
					} else {

						// Create an array for studentIds and fill it.
						let studentIds = [];
						for (let klas of classes) {
							if (klas.students.length !== 0) {
								for (let student of klas.students) {
									studentIds.push(student._id);
								}
							}
						}

						// Create an array for students and fill it.
						let students = [];
						Users.find({ _id: { $in: studentIds }}, (err, classmates) => {
							if (!err) {
								students = classmates;
							} else {
								return res.status(500).json({ succes: false, message: err });
							}
						});

						// Get all the logs from students that are a member of one of the classes of the teacher.
						Logs.find({ user: { $in: studentIds }}, (err, logs) => {
							if (!err) {
								return res.status(200).json({
									succes: true,
									logs: logs,
									classes: classes,
									students: students
								});
							} else {
								return res.status(500).json({ succes: false, message: err });
							}
						});
					}
				});
			} else {
				return res.status(404).json({ succes: false, message: err });
			}
		});
	}
});

module.exports = router;
