const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
    _id: String,
    title: {
        type: String,
        required: true
    },
    category: String,
    imagePreview: String,
    imageFull: String,
    imageFull2: String,
    price: Number,
    exp: Number
});

module.exports = mongoose.model('Item', itemSchema);