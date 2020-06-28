const router = require('express').Router();
const schemas = require('../schemas');

module.exports = (passport) => {
    const auth = require('./auth')(passport);
    // const admin = require('./admin')(passport);

    //auth routes
    router.post('/register', schemas.validator(schemas.auth.register), auth.register);
    router.post('/login', schemas.validator(schemas.auth.login), auth.login);
    router.post('/logout', auth.logout);


    return router;
}