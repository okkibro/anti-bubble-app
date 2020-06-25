/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
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
    },
    initial: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Shop', shopSchema);

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */