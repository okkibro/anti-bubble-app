const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User = mongoose.model('User');
const sanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

//router to register a user in the database
router.post('/register', (req, res) => {
    //make a new user
    let user = new User();
    //fill in data to user attributes
    user.firstName = sanitize(req.body.firstName);
    user.lastName = sanitize(req.body.lastName);
    user.email = sanitize(req.body.email);
    user.setPassword(sanitize(req.body.password));

    //save the changes to the database
    user.save(function () {
        let token = user.generateJwt();
        res.status(200).json({
            token: token
        });
    });
});

//router to check if login details match with the database (authentication)
router.post('/login', (req, res) => {
    passport.authenticate('local', function (err, user) {

        // If Passport throws/catches an error
        if (err) {
            return res.status(404).json(err);
        }

        // If no user was found
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }

        // If a user is found
        let token = user.generateJwt();
        res.status(200).json({
            token: token
        });
    })(req, res);
});

// router to send a password recovery email
router.post('/passwordrecovery', (req, res) => {

    // Generate Random Token
    let token = "";
    crypto.randomBytes(20, (error, buffer) => {
        token = buffer.toString("hex");
    });

    // Find the user with the given email and set the token
    User.findOne({ email: req.body.email }, (error, user) => {
        if (!user){
            return console.log("no user with that email");
        }

        user.recoverPasswordToken = token;
        user.recoverPasswordExpires = Date.now() + 360000;

        user.save((error) => {
            if (error){
                console.log(error.message);
            }
        })
    });

    // Send email
    nodemailer.createTestAccount((error, account) => {
        if (error) {
            return console.log(error.message);
        }

        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
              user: account.user, // generated ethereal user
              pass: account.pass // generated ethereal password
            }
        });
    
        let mailOptions = {
            from: 'Anti Bubble App <' + account.user + '>', // sender address
            to: req.body.email, // list of receivers
            subject: "Password Recovery", // Subject line
            text: "Hello world?", // plain text body
            html: "<h1>Password Recovery</h1><p>Reset Password by clicking on the following link: https://localhost:3000/user/reset/" + token // html body
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error.message);
            }
            console.log(nodemailer.getTestMessageUrl(info));
          });
    });

    res.status(200).end();
});

router.get('/reset/:token', (req, res) => {
    User.findOne({ recoverPasswordToken: req.params.token, recoverPasswordExpires: {$gt: Date.now() } }, (error, user) => {
        if (!user) {
            return console.log("wrong token or token expired");
        }

        // TODO: Load password change form
        console.log("correct token");
    });
})

//router to get a user given an id
router.get('/profile', auth, (req, res) => {

    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        // Otherwise continue
        User.findById(req.payload._id)
            .exec(function (err, user) {
                res.status(200).json(user);
            });
    }
});

//router to check if email is already present in the database
router.post('/checkEmailTaken', (req, res) => {
    User.findOne({ email: sanitize(req.body.email) }).then(user => {
        if (user) {
            return res.status(200).json({
                emailTaken: true
            });
        } else {
            return res.status(200).json({
                emailNotTaken: true
            });
        }
    });
});

//router for updating a password given an email
router.patch('/updatePassword', (req, res) => {
    User.findOne({ email: sanitize(req.body.email) }).then(user => {
        if (user) {
            //check if old password is filled in correctly
            if (user.validatePassword(sanitize(req.body.oldPassword))) {
                //update password in database to new password
                user.setPassword(sanitize(req.body.newPassword));
                //save changes to database
                user.save();
                //return status ok
                return res.status(200).json({
                    message: "password changed"
                });
            } else {
                //handle error if old password doesn't match with the one in database
                return res.status(401).json({
                    message: "password doesn't match with old password"
                });
            }
        } else {
            console.log("user not found")
            //handle error if user is not found in database
            return res.status(401).json({
                message: "user not found"
            });
        }
    });
});

module.exports = router;