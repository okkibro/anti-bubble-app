const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = mongoose.model('User');

let classSchema = new Schema({
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
    teacher: {
        type: Schema.ObjectId,
            ref: 'User',
        require: true
    }
});

module.exports = mongoose.model('Classes', classSchema);