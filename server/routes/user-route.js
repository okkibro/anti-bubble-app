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
    user.role = sanitize(req.body.role);
    user.setPassword(sanitize(req.body.password));
    user.inventory = [];
    user.avatar = { body:  mongoose.Types.ObjectId('5eca3c87f5a0edaaa09915e8'),
                    pants: mongoose.Types.ObjectId('5ecfb686974e5b139cc1972e'),
                    shirt: mongoose.Types.ObjectId('5eaa9475cc3aec14b8b6537a')
                }
    user.milestones = [];
    user.currency = 0;
    for (let i = 0; i < 9; i++) { //TODO: change 9 to correct number when done making all the milestones
        user.milestones.push(0);
    }

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
router.post('/passwordrecovery', async (req, res) => {

    // Generate Random Token
    const token = crypto.randomBytes(20).toString("hex");
    console.log(token);

    // Find the user with the given email and set the token
    User.findOne({ email: req.body.email }, (error, user) => {
        if (!user){
            console.log("no user with that email");
            res.json({ succes: false, message: "Geen gebruiker gevonden met het gegeven email adres"});
            return res.end();
        }

        user.recoverPasswordToken = token;
        user.recoverPasswordExpires = Date.now() + 360000;

        user.save((error) => {
        if (error){
            console.log(error.message);
        }
        });
        // Send email with link and token in the link
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

// router that checks the password recovery token and shows the reset password page or a wrong token error
router.get('/reset/:token', (req, res) => {
    // Find the user that belongs to the given token
    User.findOne({ recoverPasswordToken: req.params.token, recoverPasswordExpires: {$gt: Date.now() } }, (error, user) => {
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

// router that changes the password of the user belonging to the given password recovery token
router.post('/reset/:token', (req, res) => {
    // Find the user that belongs to the given token
    User.findOne({ recoverPasswordToken: req.params.token, recoverPasswordExpires: {$gt: Date.now() } }, (error, user) => {
        if (error) { return console.log(error.message); }
        if (!user) {
            console.log("wrong token or token expired");
            res.json({ succes: false, message: "wrong token or token expired" });
            return res.end();
        }

        // Change the password in the database
        if (req.body.password === req.body.confirmPassword) {
            user.setPassword(req.body.password, (error) => {
                if (error) { return console.log(error.message); }
            });
        } else {
            console.log("password and confirmation are not the same");
            res.json({ succes: false, message: "wachtwoord en bevestiging zijn niet hetzelfde" });
            return res.end();
        }

        user.recoverPasswordToken = undefined;
        user.recoverPasswordExpires = undefined;

        user.save((error) => {
            if (error) { return console.log(error.message); }
            console.log("password change succesful");
            res.json({ succes: true, message: "wachtwoord succesvol veranderd" });
            res.status(200).end();
        });
    });
});

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

router.get('/classmateProfile/:id', auth, (req, res) => {
    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        // Otherwise continue and find own and classmate's profile
        User.findById(req.payload._id, (error, user) => {
            User.findById(req.params.id, (error, classmate) => {
                // Throw error if the given id does not correspond with a user
                if (!classmate) {
                    res.status(404).json({
                        "message": "User's profile not found"
                    })
                } else {
                    // Check if classmate is actually in the same class
                    if (user.class != classmate.class) {
                        res.status(401).json({
                            "message": "Not authorized to see user's profile"
                        })
                    } else {
                        res.status(200).json(classmate);
                    }
                }
            });
        });
    }
});

router.get('/getAllClassmates', auth, (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User.findById(req.payload._id, (error, user) => {
            User.find({ class: user.class }, (error, classmates) => {
                res.status(200).json(classmates);
            });
        });
    }
})


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

// Router for getting all milestone values in an array for the logged in user
router.get('/milestone', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        res.json(user.milestones);
    });
});

// Router that changes a milestone by a given value, returns the updated value and whether it is completed or not
router.post('/milestone', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        let milestone = req.body.milestone;
        let completed = false;
        user.milestones[milestone.index] += req.body.value;
        if (user.milestones[milestone.index] > milestone.maxValue) {
            user.milestones[milestone.index] = milestone.maxValue;
            completed = true;
        }
        user.markModified('milestones');
        user.save(() => {
            res.json( { updatedValue: user.milestones[milestone.index], completed: completed } );
        });
    })
})

//Router that adds selecter item for the avatar
router.post('/avatar', auth, (req,res) => {
    User.findById(req.payload._id, (err, user) => {
        user.avatar[req.body.avatarItem.category] = req.body.avatarItem;
        user.markModified('avatar');
        user.save((error) => { 
            if (error){
                console.log(error.message);
            }
            res.status(200).json({
                image: req.body.avatarItem.fullImage,
                category: req.body.avatarItem.category
            });
        })
    })
}) 

module.exports = router;