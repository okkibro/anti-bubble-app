/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const sanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Shops = mongoose.model('shops');
const Users = mongoose.model('users');
const Classes = mongoose.model('classes');
const jwt = require('express-jwt');

// Small constant for authentication.
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

/** POST method to register a new user to the database. */
router.post('/register', (req, res) => {

    // Make a new user.
    let user = new Users();

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
        online: [0],
        social: [0],
        mainstream: [0],
        category1: [0],
        category2: [0],
        knowledge: [0],
        techSavvy: [0],
    }
    if (user.role === 'student') {
        user.bubbleInit = false;
    }
    user.currency = 0;
    user.classArray = [];
    user.milestones = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    user.recentMilestones = [];
    for (let i = 0; i < 5; i++) {
        user.recentMilestones[i] = '';
    }

    // Building the basic avatar upon registering.
    Shops.findById('5edcf97b1167982a005b9737', (err, lichaam) => {
        Shops.findById('5edcf97b1167982a005b977b', (err, broek) => {
            Shops.findById('5edcf97b1167982a005b9754', (err, shirt) => {
                Shops.findById('5edcf97b1167982a005b9787', (err, schoenen) => {
                    Shops.find({ title: 'Geen' }, (err, emptyLayers) => {
                        user.avatar = {
                            haar: emptyLayers[0],
                            hoofddeksel: emptyLayers[1],
                            bril: emptyLayers[2],
                            lichaam: lichaam,
                            broek: broek,
                            shirt: shirt,
                            schoenen: schoenen,
                            medaille: emptyLayers[3]
                        }
                        user.save(function () {
                            let token = user.generateJwt();
                            return res.status(200).json({ token: token });
                        });
                    });
                });
            });
        });
    });
});

/** POST method to check if login details match with the database (authentication). */
router.post('/login', (req, res) => {
    passport.authenticate('local',  (err, user) => {

        // If Passport throws/catches an err.
        if (err) {
            return res.status(404).json({ message: err });
        }

        // If no user was found.
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // If a user is found.
        let token = user.generateJwt();
        return res.status(200).json({ token: token });
    })(req, res);
});

/** POST method to send a password recovery email. */
router.post('/passwordrecovery', async (req, res) => {

    // Generate Random Token.
    const token = crypto.randomBytes(20).toString('hex');

    // Find the user with the given email and set the token.
    Users.findOne({ email: req.body.email }, (err, user) => {
        if (!err && user != null) {
            user.recoverPasswordToken = token;
            user.recoverPasswordExpires = Date.now() + 360000;

            user.save((err) => {
                if (err) {
                    return res.status(500).json({succes: false, message: err});
                }
            });

            // Send email with link and token in the link.
            nodemailer.createTestAccount((err, account) => {
                if (err) {
                    return res.status(500).json({succes: false, message: err});
                }

                let transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        // Generated ethereal user.
                        user: account.user,

                        // Fenerated ethereal password.
                        pass: account.pass
                    }
                });

                let mailOptions = {
                    from: 'Anti Bubble App <' + account.user + '>',
                    to: req.body.email,
                    subject: 'Password Recovery',
                    text: '',

                    // Html body.
                    html: '<h1>Password Recovery</h1>' +
                        '<p>Reset Password by clicking on the following link: https://' + req.headers.host + '/reset/' + token + '</p>'
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        return res.status(500).json({succes: false, message: err});
                    }
                    console.log(nodemailer.getTestMessageUrl(info));
                });

            });
        }
        return res.status(200).json({ succes: true, message: 'Als het e-mailadres bij ons bekend is, heeft deze zojuist een link ontvangen om een nieuw wachtwoord aan te vragen, dus check je inbox.' });
    });
});

/** GET method to check the password recovery token and shows the reset password page or a wrong token err. */
router.get('/reset/:token', (req, res) => {

    // Find the user that belongs to the given token
    Users.findOne({ recoverPasswordToken: req.params.token, recoverPasswordExpires: { $gt: Date.now() }}, (err) => {
        if (!err) {
            return res.status(200).json({ correct: true });
        } else {
            return res.status(200).json({ correct: false });
        }
    });
});

/** POST method to change the password of the user belonging to the given password recovery token. */
router.post('/reset/:token', (req, res) => {

    // Find the user that belongs to the given token
    Users.findOne({ recoverPasswordToken: req.params.token, recoverPasswordExpires: { $gt: Date.now() }}, (err, user) => {
        if (!err) {
            user.setPassword(req.body.password, (err) => {
                if (err) {
                    return res.status(500).json({ succes: false, message: err });
                }
            });

            user.recoverPasswordToken = undefined;
            user.recoverPasswordExpires = undefined;

            user.save((err) => {
                if (err) {
                    return res.status(500).json({ succes: false, message: err });
                }
                return res.status(200).json({ succes: true, message: 'Wachtwoord succesvol verandert.' });
            });
        } else {
            return res.status(200).json({ succes: false, message: 'Verkeerde of reeds verlopen token.' });
        }   
            
    });
});

/** GET method to get a user from the database given an id. */
router.get('/profile', auth, (req, res) => {

    // Check if user is authorized to perform the action.
    if (!req.payload._id) {
        return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
    } else {
        Users.findById(req.payload._id).exec(function (err, user) {
                return res.status(200).json(user);
        });
    }
});

/** POST method to check if email is already present in the database. */
router.post('/checkEmailTaken', (req, res) => {
    Users.findOne({ email: sanitize(req.body.email) }).then(user => {
        if (user) {
            return res.status(200).json({ emailTaken: true });
        } else {
            return res.status(200).json({ emailTaken: false });
        }
    });
});

/** PATCH method to update a password given an email. */
router.patch('/updatePassword', (req, res) => {

    // Check if user is authorized to perform the action.
    if (!req.payload._id) {
        return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
    } else {
        Users.findOne({email: sanitize(req.body.email)}).then(user => {
            if (user) {

                // Check if old password is filled in correctly.
                if (user.validatePassword(sanitize(req.body.oldPassword))) {

                    // Update password in database to new password.
                    user.setPassword(sanitize(req.body.newPassword));

                    // Save changes to database.
                    user.save();
                    return res.status(200).json({ succes: true, message: 'Wachtwoord succesvol verandert.' });
                } else {

                    // Handle error if old password doesn't match with the one in database.
                    return res.status(200).json({ success: false, message: 'Oude wachtwoord is niet correct.' });
                }
            } else {

                // Handle error if user is not found in database.
                return res.status(401).json({ succes: false, message: 'User not found.' });
            }
        });
    }
});

/** POST method to changes a milestone by a given value, returns the updated value and whether it is completed or not. */
router.post('/milestone', auth, (req, res) => {

    // Check if user is authorized to perform the action.
    if (!req.payload._id) {
        return res.status(401).json({message: 'UnauthorizedError: unauthorized action'});
    } else if (req.payload.role === 'teacher') {
        return res.status(200).json({message: 'Docenten kunnen geen badges ontvangen.'});
    } else {

        // Get currently logged in user.
        Users.findById(req.payload._id, (err, user) => {
            let milestone = req.body.milestone;
            let completed = false;

            // Check if milestone is already completed.
            if (user.milestones[milestone.index] === milestone.maxValue) {

                // Return completed false because it was already completed.
                return res.status(200).json({ updatedValue: milestone.maxValue, completed: completed });
            } else {

                // Add value to milestone.
                user.milestones[milestone.index] += req.body.value;

                // Check if you surpassed the max value.
                if (user.milestones[milestone.index] >= milestone.maxValue) {

                    // Set value to max value cause it cant be larger than max value.
                    user.milestones[milestone.index] = milestone.maxValue;
                    completed = true;
                }

                // Mark and save changes.
                user.markModified('milestones');
                user.save(() => {
                    return res.status(200).json({completed: completed });
                });
            }
        })
    }
});

/** POST method to post a new message to recent milestones. */
router.post('/recentMilestones', auth, (req, res) => {

    // Check if user is authorized to perform the action.
    if (!req.payload._id) {
        return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
    } else {
        Users.findById(req.payload._id, (err, user) => {
            if (!err) {

                // Push new value into the array.
                user.recentMilestones.push(req.body.value);

                // Remove oldest value of the 5.
                user.recentMilestones.shift();
                user.save(() => {
                    return res.status(200);
                });
            } else {
                return res.status(404).json({ message: err })
            }
        });
    }
});

/** POST method to equip the avatar with the send item. */
router.post('/avatar', auth, (req,res) => {

    // Check if user is authorized to perform the action.
    if (!req.payload._id) {
        return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
    } else {
        Users.findById(req.payload._id, (err, user) => {
            if (!err) {
                user.avatar[req.body.avatarItem.category] = req.body.avatarItem;
                user.markModified('avatar');
                user.save((err) => {
                    if (err) {
                        return res.status(500).json({ succes: false, message: err });
                    }
                    return res.status(200).json({
                        imageFull: req.body.avatarItem.fullImage,
                        imageFull2: req.body.avatarItem.fullImage2,
                        category: req.body.avatarItem.category
                    });
                });
            } else {
                return res.status(404).json({ message: err })
            }
        });
    }
});

/** POST method to update user bubble after performing/pausing the labyrinth. */
router.post('/processAnswers', auth, (req, res) => {

    // Check if user is authorized to perform the action.
    if (!req.payload._id) {
        return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
    } else {
        Users.findById(req.payload._id, (err, user) => {
            if (!err) {
                for (let q of req.body.answers) {
                    if (q != null) {
                        if (q.question.choiceConsequence[q.answer] !== '') {
                            let oldValue = user.bubble[q.question.choiceConsequence[q.answer]].pop();
                            let newValue = oldValue + q.question.values[q.answer];
                            if (user.bubble[q.question.choiceConsequence[q.answer]].length < 1) {
                                user.bubble[q.question.choiceConsequence[q.answer]].push(0);
                                user.bubble[q.question.choiceConsequence[q.answer]].push(newValue);
                            } else {
                                user.bubble[q.question.choiceConsequence[q.answer]].push(newValue);
                            }
                        }
                    }
                }

                for (let cat in user.bubble) {
                    if (user.bubble[cat].length < 2) {
                        user.bubble[cat].push(0)
                    }
                }

                user.markModified('bubble');
                user.save((err) => {
                    if (err) {
                        return res.status(500).json({ succes: false, message: err });
                    }
                    return res.status(200);
                });
            } else {
                return res.status(404).json({ message: err })
            }
        });
    }
});

/** DELETE method for deleting a user's account */
router.delete('/deleteAccount', auth, (req, res) => {

    // Check if user is authorized to perform the action.
    if (!req.payload._id) {
        return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
    } else {
        Users.findById(req.payload._id, (err, user) => {
            if (!err && user != null) {

                // Delete user document from 'users' collection.
                Users.findByIdAndDelete({ _id: user._id }).exec();
                if (user.role === 'student') {

                    // Delete user from 'students' array of class he was apart of (if he was apart of a class). Student document itself
                    // will be deleted so we don't have to worry about the 'classArray' here.
                    if (user.classArray.length > 0) {
                        Classes.findById(user.classArray[0], (err, userKlas) => {
                            if (!err && userKlas != null) {
                                Classes.findByIdAndUpdate({ _id: userKlas._id }, { $pull: { students: { _id: user._id }}}).exec();
                                userKlas.save();
                            } else {
                                return res.status(404).json({ succes: false, message: err });
                            }
                        });
                    }
                } else if (user.role === 'teacher') {

                    // Delete each class created by the teacher and update the 'classArray' of all the student of each class the teacher made
                    // to make sure no student is apart of a class that will no longer exist.
                    for (let klas of user.classArray) {
                        Classes.findById(klas._id, (err, userKlas) => {
                            if (!err && userKlas != null) {
                                Classes.findByIdAndDelete({ _id: userKlas._id }).exec();
                                Users.find({ 'classArray._id': userKlas._id, role: 'student' }, (err, classMembers) => {
                                    if (!err && classMembers.length > 0) {
                                        for (let classMember of classMembers) {
                                            Users.findByIdAndUpdate({ _id: classMember._id }, { $pull: { classArray: { _id: userKlas._id }}}).exec();
                                            classMember.save();
                                        }
                                    }
                                });
                            } else {
                                return res.status(404).json({ succes: false, message: err });
                            }
                        });
                    }
                }
                return res.status(200).json({
                    succes: true,
                    message: 'Account is succesvol verwijderd en je zal naar de inlogpagina worden verwezen.'
                });
            } else {
                return res.status(404).json({ succes: false, message: err });
            }
        });
    }
});

/** PATCH method that updates a field of the user in the database. */
router.patch('/updateUser', auth, (req, res) => {
    // Check if user is authorized to perform the action.
    if (!req.payload._id) {
        return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
    } else {
        Users.findById(req.payload._id, (err, user) => {
            if (!err && user != null) {
                Users.findByIdAndUpdate({ _id: user._id }, { [req.body.field]: sanitize(req.body.value) }).exec();
                user.save();
                return res.status(200).json({ succes: true, message: 'Je profiel is succesvol bijgewerkt.' });
            } else {
                return res.status(404).json({ succes: false, message: err })
            }
        });
    }
});

module.exports = router;