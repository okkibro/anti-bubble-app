const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let classSchema = new Schema({
    _id: String,
    code: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    students: {
        type: [{
            item: {type: Schema.ObjectId, ref: 'User'}
        }],
        required: true
    },
});

module.exports = mongoose.model('Classes', classSchema);