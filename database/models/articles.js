/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let articlesSchema = new Schema({
    articlenr: Number,
    part: Number,
    image: String,
    source: String,
    subject: String,
});

module.exports = mongoose.model('Articles', articlesSchema);