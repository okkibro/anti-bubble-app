/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = mongoose.model('users');

let classesSchema = new Schema({
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
            item: { type: Schema.ObjectId, ref: 'users' }
        }],
        required: true
    },
    teacher: {
        type: Schema.ObjectId, ref: 'users',
        required: true
    }
});

module.exports = mongoose.model('classes', classesSchema);