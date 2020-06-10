const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Activities = mongoose.model('Activities');
const User = mongoose.model('User');
const sanitize = require('mongo-sanitize');
const Questions = mongoose.model('Questions');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
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

router.post('/questions', auth, (req, res) => {
    Questions.find({ part: req.body.part }, (err, questions) => {
        let result = shuffle(questions);
        res.status(200).json(questions);

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

router.post('/labyrinthAnswers', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        let result = [];
        for (let i = 1; i < req.body.answers.length; i++) {
            let index = req.body.answers[i].question.id;
            result[index] = req.body.answers[i].answer;
        }
        user.labyrinthAnswers = result;
        user.save(() => {
            res.status(200).json({ succes: true });
        });
    });
});

module.exports = router;