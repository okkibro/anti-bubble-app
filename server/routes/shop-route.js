const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const Shop = mongoose.model('Shop');
const sanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = mongoose.model('User');
const Item = mongoose.model('Item');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

/** Get method to get shop items from the database based on a query. */
router.get('/', (req, res) => {
    var query = {
        category: req.headers.id.toLowerCase()
    }

    Shop.find(query)
        .exec(function (err, shop) {
            res.status(200).json(shop);
    });
});

router.get('/getBaseInventory', auth, (req, res) => {
    Shop.find({initial: true})
        .exec(function (err, shop) {
            res.status(200).json(shop);
        });
});

router.post('/buy', auth, (req, res) => {
    User.findById(req.payload._id) // Get the logged in user.
            .exec(function (err, user) {

                // Check if the user has enough money and hasnt bought the item yet.
                if (user.currency >= req.body.item.price && user.inventory.find(x => x._id == req.body.item._id) == null) {
                    user.inventory.push(req.body.item); // Add item to inventory.
                    user.currency -= req.body.item.price; // Pay the money.
                    user.save();
                    res.status(200).json( { succes: true, message: `Je hebt ${req.body.item.title} succesvol gekocht!` } ); // Show succes message.
                } else {
                    if (user.currency < req.body.item.price) {

                        // If not enough money, show appropriate message.
                        res.status(200).json( { succes: false, message: `Je hebt niet genoeg geld om ${req.body.item.title} te kopen` } );
                    } else {

                        // Else show message that item has already been bought.
                        res.status(200).json( { succes: false, message: `Je hebt ${req.body.item.title} al gekocht` } );
                    }
                }
            });
});

module.exports = router;