const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Activities = mongoose.model('Activities');
const User = mongoose.model('User');

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

module.exports = router;