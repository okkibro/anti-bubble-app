const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let activitySchema = new Schema({
    name: String,
    category: String,
    description: String,
});

module.exports = mongoose.model('Activities', activitySchema);