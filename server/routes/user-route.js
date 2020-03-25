const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();
const UserSchema = require("../../database/models/users");
// TODO: Make sure we don't need this anymore
const authorize = require("../../middlewares/auth");
const { check, validationResult } = require('express-validator');

// Register
router.post("/register", (req, res, next) => {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(req.body.password, this.salt, 1000, 64, 'sha512').toString('hex');
        const user = new UserSchema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: this.hash
        });
        user.save().then((user) => res.send(user))
            .catch((error) => console.log(error));        
    });

// Login
router.post("/login", (req, res, next) => {
    console.log(req.body)
    let getUser;
    UserSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "1h"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 86400,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Authentication failed"
        });
    });
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