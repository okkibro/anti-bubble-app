/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activities = mongoose.model('activities');
const Users = mongoose.model('users');
const Questions = mongoose.model('questions');
const Articles = mongoose.model('articles');
const jwt = require('express-jwt');

// Small constant for authentication.
const auth = jwt({
	secret: process.env.MY_SECRET,
	userProperty: 'payload',
});

/** GET method to get the articles from the database */
router.get('/articles', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Users.findById(req.payload._id, (err, user) => {
			// Get the logged in user.
			Articles.find({ }, (err, articles) => {

				// Send all article data from the database.
				return res.status(200).json(articles);
			});
		});
	}
});

/** POST method to return a given activity from the database. */
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

/** PATCH method to change the bubbleInit value to true if a user has completed the initial maze. */
router.patch('/updateBubbleInit', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get the logged in user.
		Users.findById(req.payload._id).then((user) => {

			// Set bubbleInit to true and save the schema.
			user.bubbleInit = true;
			user.save();
		});
		return res.status(200).json({ succes: true });
	}
});

/** POST method to get the array of questions shuffled, based on the part given in the body of the request. */
router.post('/questions', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Questions.find({ part: req.body.part }, (err, questions) => {
			if (!err) {
				return res.status(200).json(questions);
			} else {
				return res.status(404).json({ message: err })
			}
		});
	}
});

/** POST method to save answers to the logged in user. */
router.post('/labyrinthAnswers', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get the logged in user.
		Users.findById(req.payload._id, (err, user) => {

			// Loop over all questions and save corresponding answers to the user's answers based on the index of the question.
			for (let i = 1; i < req.body.answers.length; i++) {
				let index = req.body.answers[i].question.id;
				user.labyrinthAnswers[index] = req.body.answers[i].answer;
			}
			user.markModified('labyrinthAnswers');

			// Save the result.
			user.save(() => {
				return res.status(200).json({ succes: true });
			});
		});
	}
});

/** POST method to change currency amount for the logged in user. */
router.post('/earnMoney', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get logged in user.
		Users.findById(req.payload._id, (err, user) => {

			// Increase currency.
			user.currency += req.body.money;
			user.save(() => {
				return res.status(200);
			});
		});
	}
});

module.exports = router;
