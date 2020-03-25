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
    (req, res) => {
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
router.post("/login", (req, res) => {
    passport.authenticate('local', function(err, user){
        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }
        // If no user was found
        if (!user || !res) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }

        // TODO: Remove secret from code
        // If a user is found
        let jwtToken = jwt.sign({
            email: user.email,
            userID: user._id
        }, "longer-secret-is-better", {
            expiresIn: "1d"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 86400,
            msg: user
        });
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
router.route('/profile/:id').get(authorize, (req, res, next) => {
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