const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        min:6,
        max:255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    date: {
        type: Date,
        default: Date.now
    }

});

const schema = mongoose.model('User', userSchema);

const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),

});

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
});

module.exports = {
    schema,
    schemaRegister,
    schemaLogin
}