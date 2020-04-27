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
router.get('/', (req, res) => {
    var query = { category : req.headers.id };
    Shop.find(query)
        .exec(function (err, shop) {
            console.log(shop);
            res.status(200).json(shop);
        });
});

//router to register an item in the database
router.post('/create', (req, res) => {
    //make a new shop item
    let shop = new Shop();
    //fill in data to shop attributes
    shop.title = "bril1";
    shop.category = "bril";
    shop.image = "png";
    shop.price = "5";
    //save the changes to the database
    shop.save((error) => { 
        if (error){
            console.log(error.message);
        } 
    });
});

module.exports = router;