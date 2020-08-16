/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let activityLogSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    students: {
        type: [{
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }],
        required: true
    },
    question: {
        type: [{
            item: {
                type: String
            }
        }],
        required: true
    },
    answers: {
        type: [{
            item: {
                type: String
            }
        }],
        required: true
    }
});

module.exports = mongoose.model('activityLog', activityLogSchema);