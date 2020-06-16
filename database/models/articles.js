const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let articlesSchema = new Schema({
    articlenr: Number,
    part: Number,
    image: String,
});

module.exports = mongoose.model('Articles', articlesSchema);