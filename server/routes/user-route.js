const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();
const mongoose = require('mongoose');
const UserSchema = require("../../database/models/users");
const passport = require("passport");
// TODO: Make sure we don't need this anymore
const authorize = require("../../middlewares/auth");
const User = mongoose.model('User');

// Register
router.post("/register",
    (req, res, next) => {
        let user = new User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password = req.body.password;

        user.setPassword(req.body.password);

        user.save(function(err) {
            let token;
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        });
    });

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate('local', function(err, user, info){
        let token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
});

// Get Users
router.route('/').get((req, res) => {
    UserSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response);
        }
    })
});

// Get Single User
router.route('/user-profile/:id').get(authorize, (req, res, next) => {
    UserSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
});

module.exports = router;