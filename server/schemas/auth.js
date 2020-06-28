const Joi = require('joi');

const register = Joi.object({
    body: Joi.object({
        first_name: Joi.string()
            .min(3)
            .max(30)
            .required().trim(),
        last_name: Joi.string()
            .min(3)
            .max(30)
            .required().trim(),
        password: Joi.string()
            .min(8)
            .max(30)
            .required().trim(),
        password_confirmation: Joi.string()
            .min(8)
            .max(30)
            .required().trim(),
        email: Joi.string()
            .email()
            .max(50)
            .required().trim(),
        phone: Joi.string()
            .max(12)
            .required().trim(),
        token: Joi.string()
            .required()
    }).required()
});

const login = Joi.object({
    body: Joi.object({
        email: Joi.string()
        .email()
        .required().trim(),
        password: Joi.string().required().trim()
    }).required()
});

module.exports = {
    register,
    login
}

