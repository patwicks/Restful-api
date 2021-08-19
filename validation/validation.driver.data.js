const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        accountType: Joi.string(),
        firstname: Joi.string().required().min(2).max(255),
        lastname: Joi.string().required().min(2).max(255),
        middlename: Joi.string().required().min(2).max(255),
        gender: Joi.string().required(),
        age: Joi.string().required().min(2).max(3),
        email: Joi.string().required().min(15).max(255).email(),
        password: Joi.string().required().min(8).max(255),
        contactNo: Joi.string().required().min(10).max(10),
        otpUsed: Joi.string(),
        isValidated: Joi.boolean().required()
    });
    return schema.validate(data);
}
// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().min(15).max(255).email(),
        password: Joi.string().required().min(8).max(255),
    });
    return schema.validate(data);
}

module.exports = { 
    registerValidation,
    loginValidation };