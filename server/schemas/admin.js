const Joi = require('joi');

const addcourse = Joi.object({
	body: Joi.object({
		name: Joi.string().min(5).max(30).required().trim(),
		desc: Joi.string().min(5).required().trim(),
		price: Joi.number().precision(2).required(),
		image: Joi.any().required()
	}).required()
});

const addsubject = Joi.object({
	body: Joi.object({
		name: Joi.string().min(5).max(30).required().trim(),
		desc: Joi.string().min(5).required().trim(),
		course_id: Joi.number().integer().required()
	}).required()
});

module.exports = {
	addcourse,
	addsubject
};
