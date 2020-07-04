const router = require('express').Router();
const schemas = require('../schemas');

module.exports = (passport) => {
	const auth = require('./auth')();
	const admin = require('./admin')();
	const user = require('./user')();
	const payment = require('./payment')();

	// auth routes
	router.post('/register', schemas.validator(schemas.auth.register), auth.register);
	router.post('/login', schemas.validator(schemas.auth.login), auth.login);
	router.get('/logout', auth.logout);

	// admin routes
	router.post('/addcourse', auth.ensure, auth.access(3), schemas.validator(schemas.admin.addcourse), admin.addcourse);
	router.post(
		'/addsubject',
		auth.ensure,
		auth.access(2),
		schemas.validator(schemas.admin.addsubject),
		admin.addsubject
	);

	// user routes
	router.get('/getcourses', auth.ensure, user.viewcourses);
	router.get('/paidcourses', auth.ensure, user.viewpaidcourses);

	//payment routes
	router.post('/buycourse', auth.ensure, payment.buyCourse);
	router.post('/paytmresponse', payment.paytmResponse);

	return router;
};
