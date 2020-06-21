const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User = mongoose.model('User');
const sanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Shop = mongoose.model('Shop');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

/** Post method to register a new user to the database. */
router.post('/register', (req, res) => {
    // Make a new user.
    let user = new User();
    // Fill in (the required) data to user attributes.
    user.firstName = sanitize(req.body.firstName);
    user.lastName = sanitize(req.body.lastName);
    user.email = sanitize(req.body.email);
    user.role = sanitize(req.body.role);
    user.setPassword(sanitize(req.body.password));
    user.inventory = [];
    user.milestones = [];
    user.bubbleInit = true;
    user.bubble = {
        online:     0,
        social:     0,
        mainstream: 0,
        category1:  0,
        category2:  0,
        knowledge:  0,
        techSavvy:  0,
    }
    if (user.role == 'student') {
        user.bubbleInit = false;
    }
    user.currency = 0;
    user.class = [];

    for (let i = 0; i < 9; i++) { //TODO: change 9 to correct number when done making all the milestones
        user.milestones.push(0);
    }
    user.recentMilestones = []
    for (let i = 0; i < 5; i++) {
        user.recentMilestones[i] = "";
    }

    // Building the basic avatar upon registering.
    Shop.findById('5edcf97b1167982a005b973a', (error, lichaam) => {
        Shop.findById('5edcf97b1167982a005b977b', (error, broek) => {
            Shop.findById('5edcf97b1167982a005b9754', (error, shirt) => {
                Shop.findById('5edcf97b1167982a005b9787', (error, schoenen) => {
                    Shop.find({ title: "Geen" }, (error, emptyLayers) => {
                        user.avatar = {
                            haar : emptyLayers[0],
                            hoofddeksel : emptyLayers[1],
                            bril : emptyLayers[2],
                            lichaam : lichaam,
                            broek : broek,
                            shirt : shirt,
                            schoenen : schoenen,
                            medaille : emptyLayers[3]
                        }
                        user.save(function () {
                            let token = user.generateJwt();
                            res.status(200).json({
                                token: token
                            });
                        });
                    });
                });
            });
        });
    });
});

/** Post method to check if login details match with the database (authentication). */
router.post('/login', (req, res) => {
    passport.authenticate('local', function (err, user) {

        // If Passport throws/catches an error.
        if (err) {
            return res.status(404).json(err);
        }

        // If no user was found.
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }

        // If a user is found.
        let token = user.generateJwt();
        res.status(200).json({
            token: token
        });
    })(req, res);
});

/** Post method to send a password recovery email. */
router.post('/passwordrecovery', async (req, res) => {

    // Generate Random Token.
    const token = crypto.randomBytes(20).toString("hex");
    console.log(token);

    // Find the user with the given email and set the token.
    User.findOne({ email: req.body.email }, (error, user) => {
        if (!user) {
            res.json({ succes: false, message: "Geen gebruiker gevonden met het gegeven email adres" });
            return res.end();
        }

        user.recoverPasswordToken = token;
        user.recoverPasswordExpires = Date.now() + 360000;

        user.save((error) => {
            if (error) {
                console.log(error.message);
            }
        });
        
        // Send email with link and token in the link.
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
                from: 'Anti Bubble App <' + account.user + '>',
                to: req.body.email,
                subject: "Password Recovery",
                text: "",
                html: "<h1>Password Recovery</h1><p>Reset Password by clicking on the following link: https://" + req.headers.host + "/reset/" + token // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error.message);
                }
                console.log(nodemailer.getTestMessageUrl(info));
            });

            res.json({ succes: true, message: "Email succesvol verzonden" })
            return res.status(200).end();
        });
    });
});

/** Get method to check the password recovery token and shows the reset password page or a wrong token error. */
router.get('/reset/:token', (req, res) => {
    // Find the user that belongs to the given token
    User.findOne({ recoverPasswordToken: req.params.token, recoverPasswordExpires: { $gt: Date.now() } }, (error, user) => {
        if (!user) {
            console.log("wrong token or token expired");
            res.json({ correct: false });
            res.status(200).end();
        } else {
            console.log("correct token");
            res.json({ correct: true });
            res.status(200).end();
        }
    });
});

/** Post method to change the password of the user belonging to the given password recovery token. */
router.post('/reset/:token', (req, res) => {
    // Find the user that belongs to the given token
    User.findOne({ recoverPasswordToken: req.params.token, recoverPasswordExpires: { $gt: Date.now() } }, (error, user) => {
        if (error) { return console.log(error.message); }
        if (!user) {
            console.log("wrong token or token expired");
            res.json({ succes: false, message: "wrong token or token expired" });
            return res.end();
        }

        user.setPassword(req.body.password, (error) => {
            if (error) {
                return console.log(error.message);
            }
        });

        user.recoverPasswordToken = undefined;
        user.recoverPasswordExpires = undefined;

        user.save((error) => {
            if (error) {
                return console.log(error.message);
            }
            res.json({ succes: true, message: "Wachtwoord succesvol verandert" });
            res.status(200).end();
        });
    });
});

/** Get method to get a user from the database given an id. */
router.get('/profile', auth, (req, res) => {
    // If no user ID exists in the JWT return a 401.
    if (!req.payload._id) {
        res.status(401).json({
            message: "UnauthorizedError: private profile"
        });
    } else {
        User.findById(req.payload._id).exec(function (err, user) {
                res.status(200).json(user);
        });
    }
});

/** Post method to check if email is already present in the database. */
router.post('/checkEmailTaken', (req, res) => {
    User.findOne({ email: sanitize(req.body.email) }).then(user => {
        if (user) {
            return res.status(200).json({
                emailTaken: true
            });
        } else {
            return res.status(200).json({
                emailTaken: false
            });
        }
    });
});

/** Patch method to update a password given an email. */
router.patch('/updatePassword', (req, res) => {
    User.findOne({ email: sanitize(req.body.email) }).then(user => {
        if (user) {
            // Check if old password is filled in correctly.
            if (user.validatePassword(sanitize(req.body.oldPassword))) {
                // Update password in database to new password.
                user.setPassword(sanitize(req.body.newPassword));
                // Save changes to database.
                user.save();
                return res.status(200).json({ succes: true, message: "Wachtwoord succesvol verandert" });
            } else {
                // Handle error if old password doesn't match with the one in database.
                return res.status(200).json({ success: false, message: "Oude wachtwoord is niet correct"});
            }
        } else {
            console.log("user not found")
            // Handle error if user is not found in database.
            return res.status(401).json({ succes: false, message: "User not found" });
        }
    });
});

/** Get method to get all milestone values in an array for the logged in user. */
router.get('/milestone', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        res.json(user.milestones);
    });
});

/** Post method to changes a milestone by a given value, returns the updated value and whether it is completed now or not */
router.post('/milestone', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => { // Get currently logged in user
        let milestone = req.body.milestone;
        let completed = false;
        if (user.milestones[milestone.index] === milestone.maxValue) { // Check if milestone is already completed
            res.json({ updatedValue: milestone.maxValue, completed: completed }); // Return completed false because it was already completed
        } else {
            user.milestones[milestone.index] += req.body.value; // Add value to milestone
            if (user.milestones[milestone.index] >= milestone.maxValue) { // Check if you surpassed the max value
                user.milestones[milestone.index] = milestone.maxValue; // Set value to max value cause it cant be larger than max value
                completed = true;
            }
            // Mark and save changes
            user.markModified('milestones');
            user.save(() => {
                res.json({ updatedValue: user.milestones[milestone.index], completed: completed });
            });
        }
    })
});

/** Post method to post a new message to recent milestones */
router.post('/recentMilestones', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        user.recentMilestones.push(req.body.value); // Push new value into the array
        user.recentMilestones.shift(); // Remove oldest value of the 5
        user.save(() => {
            res.end();
        });
    })
});

/** Post method to equip the avatat with the send item */
router.post('/avatar', auth, (req,res) => {
    User.findById(req.payload._id, (err, user) => {
        user.avatar[req.body.avatarItem.category] = req.body.avatarItem;
        user.markModified('avatar');
        user.save((error) => {
            if (error) {
                console.log(error.message);
            }
            res.status(200).json({
                imageFull: req.body.avatarItem.fullImage,
                imageFull2: req.body.avatarItem.fullImage2,
                category: req.body.avatarItem.category
            });
        });
    });
});

/** Post method to update the bubble graph in the detailed profile page */
// TODO: FIX RES WITH A CORRECT STATUS AND JSON!
router.post('/updateGraph', auth, (req, res) => {
    User.updateOne(
        { _id: req.payload._id },
        { $push: { knowledge: req.body.knowledgeScore, diversity: req.body.diversityScore } },
        () => {
            res.json({});
        }
    );
});

/** Post method to update user bubble */
router.post('/updateBubble', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        user.bubble[req.body.bubbleConsequence]++;
        user.markModified('bubble');
        user.save((error) => { 
            if (error){
                console.log(error.message);
            }
            res.status(200).json({message: "done"});
        });
    });
});
module.exports = router;