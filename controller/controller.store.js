const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Store = require('../models/model.store');
const dotenv = require('dotenv');
const otpGenerator = require('generate-otp');
const { registerValidationStore, loginValidationStore } = require('../validation/validation.store.data');

dotenv.config();
const MESSAGE_CLIENT = require('twilio')(process.env.SMS_API_SID, process.env.SMS_API_TOKEN);
// get all the user
const GET_ALL_STORE = async (req, res) => {
    try{
        const stores = await Store.find();
        res.json(stores);
    }catch(err) {
        res.status(400).json({error: "Cannot fetch any data!"});
    }
}
// Get a specific user
const FIND_ONE_STORE =  async (req, res) => {
    try {
     const store = await Store.findById(req.params.storeId);
     res.json(store);
    } catch (err) {
     res.json({error: "No store found!"})
    }
 }

// Create a new user
const CREATE_NEW_STORE = async (req, res) => {
    // Validate Regsitration input
    const {error} = registerValidationStore(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check email if already existing to the datbase
    const checkEmailExist = await Store.findOne({email: req.body.email});
    if(checkEmailExist) return res.status(400).json({error: 'Email already in used!'});

    // Hasing password using Bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // generate random otp numbers
    const myOTP = otpGenerator.generate(6);
    // generate random user id
    const accountType = 'store';
    const store = new Store({
        accountType: accountType,
        firstname: req.body.firstname.trim(),
        lastname: req.body.lastname.trim(),
        middlename: req.body.middlename.trim(),
        gender: req.body.gender,
        age: req.body.age,
        storeName: req.body.storeName.trim(),
        storeAddress: req.body.storeAddress.trim(),
        email: req.body.email.trim(),
        password: hashedPassword,
        contactNo: req.body.contactNo,
        otpUsed: myOTP,
        isValidated: req.body.isValidated
    });
    try{
        const saveNewUser = await store.save();
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
        res.status(400).json({error: 'Failed to register!'});
        console.log(err.message)
    }
}

// Login the store
const LOGIN_STORE =  async (req, res) => {
    const {error} = loginValidationStore(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    try{
    // Check email if already existing to the database
    const store = await Store.findOne({email: req.body.email});
    const validated = store.isValidated;
    const validPassword = await bcrypt.compare(req.body.password, store.password);
    if(!store || !validPassword){
        return res.status(400).json({error: 'Invalid email or password!'});
    }
    else if(validated === false){
        return res.status(400).json({error: 'Please validate your account!'});
    }
    // Password is Correct
    // create and assigned token
    const token = jwt.sign({_id: store._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json(store);
    }catch(err) {
    res.status(400).json({error: 'Failed to login!'})
    }  
}
// update userdata

const UPDATE_STORE_DATA = async (req, res) =>  {
    try {
         // Hasing password using Bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const updateUserData = await Store.updateOne(
            {_id: req.params.storeId},
            {$set: {
                firstname: req.body.firstname.trim(),
                lastname: req.body.lastname.trim(),
                middlename: req.body.middlename.trim(),
                gender: req.body.gender,
                age: req.body.age,
                storeName: req.body.storeName.trim(),
                storeAddress: req.body.storeAddress.trim(),
                email: req.body.email.trim(),
                password: hashedPassword,
                contactNo: req.body.contactNo}}
        );
        res.status(200).json({message: "Updated Successfully!"})
    } catch (error) {
        res.status(400).json({error: 'Unexpected error occured. Try again!'})
    }
}

// Validate account
const VALIDATE_ACCOUNT =  async (req, res) => {
    const store = await Store.findOne({email: req.body.email});
    if(store){
        if(req.body.otpUsed === store.otpUsed) {
            try {
            const validate = await Store.updateOne(
                {_id: req.params.storeId},
                {$set: {
                    isValidated: true}}
            );
                res.status(200).json({message: "Verified!"})
            } catch (error) {
                res.status(400).json({error: 'Unexpected error occured. Try again!'})
            } 
        }else {
            res.status(400).json({error: 'Wrong OTP!'})
        }
    }
    else{
        res.status(400).json({error: 'Unexpected error occured. Try again!'})
    }
 }
//  Resend Otp
const RESEND_OTP = async (req, res) => {
    const store = await Store.findOne({_id: req.params.stroreId});
     try {
        // generate random otp numbers
        const myOTP = otpGenerator.generate(6);
       const updateOtpUsed = await Store.updateOne(
           {_id: req.params.storeId},
           {$set: {otpUsed: myOTP}}
       );
       if(updateOtpUsed) {
        try {
            MESSAGE_CLIENT.messages.create({
                body:`This is your OTP from Find-talyer App: ${myOTP}`,
                from: '+19316503399',
                to: `+63${store.contactNo}`
            })
        } catch (error) {
           console.log(error.message);
        }
    }
    
    res.status(200).json({message: "Resend Successfully!"})
   } catch (error) {
       res.status(400).json({error: 'Unexpected error occured. Try again!'})
   }
}

 module.exports = {
    GET_ALL_STORE,
    FIND_ONE_STORE,
    CREATE_NEW_STORE,
    LOGIN_STORE,
    UPDATE_STORE_DATA,
    VALIDATE_ACCOUNT,
    RESEND_OTP
 }