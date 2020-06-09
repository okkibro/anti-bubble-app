const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Activities = mongoose.model('Activities');
const User = mongoose.model('User');
const sanitize = require('mongo-sanitize');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

/** Post method to return a given activity from the database. */
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

/** Patch method to change the bubbleInit value to true if a user has completed the initial maze. */
router.patch('/updateBubbleInit', (req, res) => {
    User.findOne({ email: sanitize(req.body.email) }).then(user => {
        user.bubbleInit = true;
        user.save();
    });
    res.json({ succes: true });
});

module.exports = router;