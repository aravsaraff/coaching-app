const router = require('express').Router();

module.exports = (passport) => {
    const auth = require('auth')(passport);
    const admin = require('admin')(passport);

    //auth routes
    router.post('/register', auth.register);
    router.post('/login', auth.login);
    router.post('/logout', auth.logout);
    
    return router;
}