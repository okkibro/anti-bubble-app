/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let logsSchema = new Schema({
	activity : { type: Schema.Types.ObjectId, ref: 'activities', required: true },
	answers: { type: [String], required: true },
	class: { type: Schema.Types.ObjectId, ref: 'classes', required: true },
	questions: { type: [String], required: true },
	students: {
		type: [{
			item: { type: Schema.Types.ObjectId, ref: 'users' }
		}],
		required: true
	},
	user: { type: Schema.Types.ObjectId, ref: 'users', required: true }
});

module.exports = mongoose.model('logs', logsSchema);