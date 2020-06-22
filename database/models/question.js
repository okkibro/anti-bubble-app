/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questionSchema = new Schema({
    id: Number,
    question: String,
    part: Number,
    choices: [String],
    choiceConsequence: [String],
    multipleAnswers: Boolean,
});

module.exports = mongoose.model('Questions', questionSchema);