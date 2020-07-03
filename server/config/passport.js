const db = require('../models/index');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try{
            let user = await db.user.findOne({
                where : { id: id }
            });
            return done(null,user);
        } catch (err) {
            console.log(err);
            return done(err,null);
        }
    });
};

