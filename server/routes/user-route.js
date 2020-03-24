const express = require('express');
const mongoose = require('../../database/mongoose')
const router = express.Router();

// • Declaring GET method
router.get('/', function (req, res) {
    User.find({email: req.body.email})
        .then((user) => res.redirect('/user'))
        .catch((error) => console.log(error))
});

// • Declaring POST method
router.post('/register', function (req, res) {

});

module.exports = router;
