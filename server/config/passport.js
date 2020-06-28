const db = require('../models/index');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.user.findOne({ id: id }, (err, user) => {
           return done(null, user); 
        });
    });

    passport.use(new LocalStrategy(
        (email, password, done) => {
            let user = db.User.findOne({
               where: { email: email}
            });
            if(!user) return done(null, false, {message: 'Incorrect email'});
            if(user.password !== password) return done(null, false, {message: 'Incorrect password'});
            return done(null, user);
        }
    ));
};

