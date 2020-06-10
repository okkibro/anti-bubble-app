const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questionSchema = new Schema({
    id: Number,
    question: String,
    part: Number,
    choices: [String],
    multipleAnswers: Boolean,
});

module.exports = mongoose.model('Questions', questionSchema);