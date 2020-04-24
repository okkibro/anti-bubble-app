const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const Shop = mongoose.model('Shop');
const sanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

//router to gets shop items from the database based on a query
router.get('/', auth, (req, res) => {
    var query = "{}";
    Shop.find(query)
        .exec(function (err, shop) {
            res.status(200).json(shop);
        });
});

module.exports = router;