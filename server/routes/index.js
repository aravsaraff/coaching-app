const router = require('express').Router();
const schemas = require('../schemas');

module.exports = (passport) => {
    const auth = require('./auth')();
    const admin = require('./admin')();
    const user = require('./user')();

    //auth routes
    router.post('/register', schemas.validator(schemas.auth.register), auth.register);
    router.post('/login', schemas.validator(schemas.auth.login), auth.login);
    router.post('/logout', auth.logout);

    //admin routes
    router.post('/addcourse', auth.ensure, auth.access(2), schemas.validator(schemas.admin.addcourse), admin.addcourse);
    router.post('/addsubject',auth.ensure, auth.access(2), schemas.validator(schemas.admin.addsubject), admin.addsubject);

    //user routes
    router.get('/courses',auth.ensure,user.viewcourses);

    return router;
}