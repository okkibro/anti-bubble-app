const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User = mongoose.model('User');

const jwt = require('express-jwt');
const auth = jwt({
    secret: 'longer-secret-is-better',
    userProperty: 'payload'
});

// Register
router.post('/register', (req, res) => {
    let user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;

    user.setPassword(req.body.password);

    user.save(function(err) {
        let token = user.generateJwt();
        res.status(200).json({
            token: token
        });
    });
});

// Login
router.post( '/login', (req, res) => {

    console.log("Here 4");

    passport.authenticate('local', function(err, user){

        console.log(user);

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }
        // If no user was found
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }

        // TODO: Remove secret from code
        // If a user is found
        let token = user.generateJwt();
        res.status(200).json({
            token: token
        });

        console.log("Here 6");
    })(req, res);
});

// Get Single User
router.get('/profile', auth, (req, res) => {

    console.log("Here 9");

    // If no user ID exists in the JWT return a 401
    if (!req.params._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        // Otherwise continue
        User.findById(req.params._id)
            .exec(function(err, user) {
                res.status(200).json(user);
            });
    }
});

module.exports = router;