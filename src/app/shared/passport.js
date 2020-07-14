/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const Users = mongoose.model('users');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (username, password, done) {
        Users.findOne({ email: sanitize(username) }, function (err, user) {
            if (err) {
                return done(err);
            }

            // Return if user not found in database
            if (!user || !user.validatePassword(sanitize(password))) {
                return done(null, false, {
                    message: 'Bad login credentials'
                });
            }

            // If credentials are correct, return the user object
            return done(null, user);
        });
    }
));