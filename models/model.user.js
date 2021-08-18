const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    lastname: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    middlename: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true,
        min: 2,
        max: 3
    },
    email: {
        type: String,
        required: true,
        min: 15,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    contactNo: {
        type: String,
        required: true,
        min: 10,
        max: 10
    },
    otpUsed: {
        type: String
    },
    isValidated: {
        type: Boolean,
        required: true
    },
    dateOfRegistration: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);