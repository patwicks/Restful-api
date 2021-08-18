const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/model.user');
const dotenv = require('dotenv');
const otpGenerator = require('generate-otp');
const crypto = require('crypto');
const { registerValidation, loginValidation } = require('../validation/driver.data.validation');

dotenv.config();
const MESSAGE_CLIENT = require('twilio')(process.env.SMS_API_SID, process.env.SMS_API_TOKEN);
// get all the user
const GET_ALL_USER = async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch(err) {
        res.status(400).json({message: err});
    }
}
// Get a specific user
const FIND_ONE_USER =  async (req, res) => {
    try {
     const user = await User.findById(req.params.userId);
     res.json(user);
    } catch (err) {
     res.json({message: "No user found!"})
    }
 }

// Create a new user
const CREATE_NEW_USER = async (req, res) => {

    // Validate Regsitration input
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check email if already existing to the datbase
    const checkEmailExist = await User.findOne({email: req.body.email});
    if(checkEmailExist) return res.status(400).json({message: 'Email already in used!'});

    // Hasing password using Bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // generate random otp numbers
    const myOTP = otpGenerator.generate(6);
    // generate random user id

    const user = new User({
        firstname: req.body.firstname.trim(),
        lastname: req.body.lastname.trim(),
        middlename: req.body.middlename.trim(),
        gender: req.body.gender,
        age: req.body.age,
        email: req.body.email.trim(),
        password: hashedPassword,
        contactNo: req.body.contactNo,
        otpUsed: myOTP,
        isValidated: req.body.isValidated
    });
    try{
        const saveNewUser = await user.save();
        // send sms otp numbers
        if(saveNewUser) {
            try {
                MESSAGE_CLIENT.messages.create({
                    body:`This is your OTP from Find-talyer App: ${myOTP}`,
                    from: '+19316503399',
                    to: `+63${req.body.contactNo}`
                })
            } catch (error) {
               console.log(error.message);
            }
        }
        res.status(200).json(saveNewUser);
    }catch(err){
        res.status(400).json({message: 'Failed to register!'});
        console.log(err.message)
    }
}

// Login the user
const LOGIN_USER =  async (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    try{
    // Check email if already existing to the database
    const user = await User.findOne({email: req.body.email});
    const validated = user.isValidated;
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!user || !validPassword){
        return res.status(400).json({message: 'Invalid email or password!'});
    }
    else if(validated === false){
        return res.status(400).json({message: 'Please validate your account!'});
    }
    // Password is Correct
    // create and assigned token
    const token = jwt.sign({_id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json(user);
    }catch(err) {
    res.status(400).json({message: 'Failed to login!'})
    }  
}
// update userdata

const UPDATE_USER_DATA = async (req, res) =>  {
    try {
         // Hasing password using Bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const updateUserData = await User.updateOne(
            {_id: req.params.userId},
            {$set: {
                firstname: req.body.firstname.trim(),
                lastname: req.body.lastname.trim(),
                middlename: req.body.middlename.trim(),
                gender: req.body.gender,
                age: req.body.age,
                email: req.body.email.trim(),
                password: hashedPassword,
                contactNo: req.body.contactNo}}
        );
        res.status(200).json({successMessage: "Updated Successfully!"})
    } catch (error) {
        res.status(400).json({message: 'Unexpected error occured. Try again!'})
    }
}

// Validate account
const VALIDATE_ACCOUNT =  async (req, res) => {

    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).json({message: 'No Account is Found!'})
    }
    else {
        if(req.body.otpUsed === user.otpUsed){
            try {
                const validate = await User.updateOne(
                    {_id: req.params.userId},
                    {$set: {
                        isValidated: true}}
                );
                res.status(200).json({message: "Updated Successfully!"})
            } catch (error) {
                res.status(400).json({message: 'Unexpected error occured. Try again!'})
            }
        }
    }
 }

 module.exports = {
    GET_ALL_USER,
    FIND_ONE_USER,
    CREATE_NEW_USER,
    LOGIN_USER,
    UPDATE_USER_DATA,
    VALIDATE_ACCOUNT
 }