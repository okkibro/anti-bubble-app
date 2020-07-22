/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Shops = mongoose.model('shops');
const Users = mongoose.model('users');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

/** GET method to get shop items from the database based on a query. */
router.get('/', (req, res) => {
    let query = {
        category: req.headers.id.toLowerCase()
    }

    Shops.find(query)
        .exec(function (err, shop) {
            return res.status(200).json(shop);
        });
});

router.get('/getBaseInventory', auth, (req, res) => {
    Shops.find({ initial: true }).exec(function (err, shop) {
        return res.status(200).json(shop);
    });
});

router.post('/buy', auth, (req, res) => {

    // Get the logged in user.
    Users.findById(req.payload._id).exec(function (err, user) { 
        
    // Check if the user has enough money and hasnt bought the item yet.
        if (user.currency >= req.body.item.price && user.inventory.find(x => x._id === req.body.item._id) == null) {

            // Add item to inventory.
            user.inventory.push(req.body.item);

            // Pay the money.
            user.currency -= req.body.item.price;
            user.markModified('inventory');
            user.save();

            // Show succes message.
            return res.status(200).json({ succes: true, message: `Je hebt ${req.body.item.title} succesvol gekocht!` });
        } else {
            if (user.currency < req.body.item.price) {

                // If not enough money, show appropriate message.
                return res.status(200).json({ succes: false, message: `Je hebt niet genoeg geld om ${req.body.item.title} te kopen` });
            } else {

                // Else show message that item has already been bought.
                return res.status(200).json({ succes: false, message: `Je hebt ${req.body.item.title} al gekocht` });
            }
        }
    });
});

module.exports = router;