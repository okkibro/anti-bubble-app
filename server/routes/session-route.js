const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Activities = mongoose.model('Activities');
const User = mongoose.model('User');
const sanitize = require('mongo-sanitize');
const Questions = mongoose.model('Questions');
const Articles = mongoose.model('Articles');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});


router.get('/articles', auth, (req, res) => {
    Articles.find({}, (err, articles) => { 
        res.json(articles); 
    });
});


/** Router that gets an activity based on the given string in the body of the request. */
router.post('/activity', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => { // Get the logged in user.
        if (user.role == "student") {
            res.status(401).json({
                message: "UnauthorizedError: Not a teacher" // Only teachers can send requests to get activities.
            });
        } else {
            Activities.findOne({ name: req.body.activity }, (err, activity) => { // Find activity in database based on the name sent in the body.
                res.status(200).json(activity); // Send the activity object returned by the findOne function.
            });
        }
    });
});

/** Router that updates the bubbleInit boolean of the logged in user to true. */
router.patch('/updateBubbleInit', auth, (req, res) => {
    User.findById(req.payload._id).then(user => { // Get the logged in user.

        // Set bubbleInit to true and save the schema.
        user.bubbleInit = true;
        user.save();
    });
    res.json({ succes: true });
});

/** Router that gets array of questions shuffled, based on the part given in the body of the request. */
router.post('/questions', auth, (req, res) => {
    Questions.find({ part: req.body.part }, (err, questions) => { // Get all questions in normal order.
        let result = shuffle(questions); // Shuffle the questions.
        res.status(200).json(questions); // Send the questions to front-end.

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
    });
});

/** Router that saves answers to the logged in user. */
router.post('/labyrinthAnswers', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => { // Get the logged in user.

        // Loop over all questions and save corresponding answers to result based on the index of the question.
        let result = [];
        for (let i = 1; i < req.body.answers.length; i++) {
            let index = req.body.answers[i].question.id;
            result[index] = req.body.answers[i].answer;
        }

        // Save the result.
        user.labyrinthAnswers = result;
        user.save(() => {
            res.status(200).json({ succes: true });
        });
    });
});

module.exports = router;