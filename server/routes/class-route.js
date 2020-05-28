const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User = mongoose.model('User');
const Classes = mongoose.model('Classes');
const sanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('express-jwt');

const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
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

router.post('/createClass', auth, (req, res) => {
    //make a new user
    let classes = new Classes();
    //fill in data to classes attributes
    classes.code = sanitize(req.body.classes.code);
    classes.level = sanitize(req.body.classes.level);
    classes.year = sanitize(req.body.classes.year);
    classes.title = sanitize(req.body.classes.title);
    classes.teacher = sanitize(req.body.teacher);
    classes.students = [];
    //save the changes to the database
    classes.save().then(() => {
        console.log('saved class');
        res.status(200).json(classes.code);;
    }).catch(err => {
        res.status(400).send(err);
    });
});

router.get('/getClass', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        Classes.findOne({ code: user.class }, (err, foundClass) => {
            res.json({ class: foundClass });
        })
    })
});

/*TODO: Rewrite to suit new usermodel*/
router.post('/joinClass', auth, (req, res) => {
    User.findById(req.payload._id, (err, user) => {
        Classes.findOne({ code: req.body.code }, (err, foundClass) => {
            if (!foundClass) {
                res.json({ succes: false, message: "Geen klas gevonden met de gegeven code" });
            } else {
                if (user.role == 'student') {
                    if (foundClass.students.find(x => x._id == req.payload._id) != undefined) {
                        res.status(200).json({ succes: false, message: "Je zit al in klas: " + foundClass.title});
                    } else {
                        foundClass.students.push(user);
                        foundClass.save().catch(err => {
                            res.status(400).send(err);
                        });
                        user.class.push(foundClass);
                        user.save().catch(err => {
                            res.status(400).send(err);
                        });
                        res.status(200).json({succes: true, message: `Leerling is succesvol toegevoegd aan de klas ${foundClass.title}`});
                    }
                } else {
                    user.class.push(foundClass);
                    user.save().then(() => {
                        res.status(200).json({succes: true, message: `Docent is succesvol toegevoegd aan de klas ${foundClass.title}`});
                    }).catch(err => {
                        res.status(400).send(err);
                    });
                }
            }
        });
    });
});

module.exports = router;