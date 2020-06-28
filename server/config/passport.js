const db = require('../models/index');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.user.findOne({ id: id }, (err, user) => {
           return done(null, user); 
        });
    });
};

