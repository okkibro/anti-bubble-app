/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
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

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */