const db = require('../models/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = (passport) => {
	let exp = {};

	exp.register = async (req, res) => {
		try {
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
				cust_id: null,
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
				console.log('Success');
				return res.status(200).send('Login successful');
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
			res.send(200).status('Logout successful');
		});
	};

	return exp;
};
