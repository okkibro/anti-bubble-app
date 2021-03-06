/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let activitiesSchema = new Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },
	description: { type: String, required: true },
	goal: { type: String, required: true },
	explanation: { type: String, required: true },
	timed: { type: Boolean, required: true },
	teams: { type: Boolean, required: true }
});

module.exports = mongoose.model('activities', activitiesSchema);