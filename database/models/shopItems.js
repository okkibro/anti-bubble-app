const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

let shopSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    previewImage: {
        type: String,
        required: true
    },
    fullImage: {
        type: String,
        required: true
    },
    fullImage2: {
        type: String
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Shop', shopSchema);