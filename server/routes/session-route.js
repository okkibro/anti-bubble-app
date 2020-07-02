/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activities = mongoose.model('Activities');
const User = mongoose.model('User');
const Questions = mongoose.model('Questions');
const Articles = mongoose.model('Articles');

const jwt = require('express-jwt');
const auth = jwt({
	secret: process.env.MY_SECRET,
	userProperty: 'payload',
});

/** Get method to get the articles from the database */
router.get('/articles', auth, (req, res) => {
	User.findById(req.payload._id, (err, user) => {
		// Get the logged in user.
		Articles.find({}, (err, articles) => {

			// Send all article data from the database.
			res.status(200).json(articles);
		});
	});
});

/** Post method to return a given activity from the database. */
router.post('/activity', auth, (req, res) => {
	User.findById(req.payload._id, (err, user) => {

		// Get the logged in user.
		if (user.role === 'student') {
			res.status(401).json({

				// Only teachers can send requests to get activities.
				message: 'UnauthorizedError: Not a teacher',
			});
		} else {
			Activities.findOne({ name: req.body.activity }, (err, activity) => {

				// Find activity in database based on the name sent in the body.
				// Send the activity object returned by the findOne function.
				res.status(200).json(activity);
			});
		}
	});
});

/** Patch method to change the bubbleInit value to true if a user has completed the initial maze. */
router.patch('/updateBubbleInit', auth, (req, res) => {

	// Get the logged in user.
	User.findById(req.payload._id).then((user) => {

		// Set bubbleInit to true and save the schema.
		user.bubbleInit = true;
		user.save();
	});
	res.status(200).json({ succes: true });
});

/** Post method to get the array of questions shuffled, based on the part given in the body of the request. */
router.post('/questions', auth, (req, res) => {
	Questions.find({ part: req.body.part }, (err, questions) => {
		if (!err) {
			res.status(200).json(questions);
		} else {
			res.status(404).json({message: err})
		}
	});
});

/** Post method to save answers to the logged in user. */
router.post('/labyrinthAnswers', auth, (req, res) => {

	// Get the logged in user.
	User.findById(req.payload._id, (err, user) => {
		
		// Loop over all questions and save corresponding answers to the user's answers based on the index of the question.
		for (let i = 1; i < req.body.answers.length; i++) {
			let index = req.body.answers[i].question.id;
			user.labyrinthAnswers[index] = req.body.answers[i].answer;
		}
		user.markModified('labyrinthAnswers');

		// Save the result.
		user.save(() => {
			res.status(200).json({ succes: true });
		});
	});
});

/** Post method to change currency amount for the logged in user. */
router.post('/earnMoney', auth, (req, res) => {

	// Get logged in user.
	User.findById(req.payload._id, (err, user) => {

		// Increase currency.
		user.currency += req.body.money;
		user.save(() => {
			res.status(200);
		});
	})
});

module.exports = router;

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
