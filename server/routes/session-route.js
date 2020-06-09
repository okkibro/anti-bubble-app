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

router.post('/activity', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        if (user.role == "student") {
            res.status(401).json({
                message: "UnauthorizedError: Not a teacher"
            });
        } else {
            Activities.findOne({ name: req.body.activity }, (err, activity) => {
                res.status(200).json(activity);
            });
        }
    });
});

router.patch('/updateBubbleInit', (req, res) => {
    User.findOne({ email: sanitize(req.body.email) }).then(user => {
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

module.exports = router;