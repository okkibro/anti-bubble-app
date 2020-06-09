const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/** Method to activate and connect the local database to a url so express can use it. */ 
mongoose.connect('mongodb://127.0.0.1:27017/anti-bubble', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database is connected"))
    .catch((error) => console.log(error));

module.exports = {
    Item:       require('./models/item'),
    User:       require('./models/users'),
    Shop:       require('./models/shopItems'),
    Classes:    require('./models/classes'),
    Activities: require('./models/activities'),
};