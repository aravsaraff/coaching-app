const db = require('../models/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');
const uuid = require('uuid/v4');

const RECAPTCHA_SECRET = '6LeoraoZAAAAABjN20iYRPLkjPEc-Vm6CgcM7jQf';

require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = () => {
	let exp = {};

	exp.ensure = (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		console.log('Not logged in.');
		return res.status(401).send('Not logged in.');
	};

	exp.access = (level) => (req, res, next) => {
		if (req.user && req.user.access >= level) return next();
		return res.status(403).send('Access Forbidden');
	};

	exp.register = async (req, res) => {
		try {
			console.log(req.body.token);
			let captchaResp = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
				params: {
					secret: RECAPTCHA_SECRET,
					response: req.body.token
				}
			});
			console.log(captchaResp.data);
			if (captchaResp.success === false) return res.status(500).send('Captcha failed');
			let userExists = await db.user.findOne({
				where: { email: req.body.email }
			});
			if (userExists && userExists.email === req.body.email) return res.status(409).send('Email already exists');
			if (req.body.password !== req.body.password_confirmation) return res.status(409).send('Passwords do not match');

			let salt = await bcrypt.genSalt();
			let hash = await bcrypt.hash(req.body.password, salt);
			let userData = {
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				password: hash,
				phone: req.body.phone,
				cust_id: uuid(),
				access: 1
			};
			let newUser = await db.user.create(userData);
			if (newUser) return res.status(200).send('Successfully registered' + newUser.email);
		} catch (err) {
			console.log(err);
			return res.status(500).send(err);
		}
	};

	exp.login = async (req, res) => {
		try {
			let user = await db.user.findOne({
				where: { email: req.body.email }
			});
			if (!user) return res.status(401).send('Invalid email or password');
			let check = await bcrypt.compare(req.body.password, user.password);
			if (!check) return res.status(401).send('Invalid email or password');
			req.login(user, (err) => {
				if (err) res.status(401).send(err);
				console.log('Login success');
				return res.status(200).send(user);
			});
		} catch (err) {
			console.log(err);
			return res.status(500).send(err);
		}
	};

	exp.logout = async (req, res) => {
		req.session.destroy((err) => {
			if (err) return res.status(500).send(err);
			req.logout();
			console.log('Logged out');
			res.status(200).send('Logout successful');
		});
	};

	return exp;
};
