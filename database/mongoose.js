/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/**
 * Method to activate and connect the local database to a url so express can use it.
 */
mongoose.connect('mongodb://127.0.0.1:27017/anti-bubble', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(() => console.log('Database is connected'))
	.catch((error) => console.log(error));

module.exports = {
	users: require('./models/users'),
	items: require('./models/items'),
	classes: require('./models/classes'),
	activities: require('./models/activities'),
	questions: require('./models/questions'),
	articles: require('./models/articles'),
	logs: require('./models/logs')
};
