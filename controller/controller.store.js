const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Store = require("../models/model.store");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const otpGenerator = require("generate-otp");
const crypto = require("crypto");
const cloudinary = require("../utility/utility.cloudinary");
const {
  registerValidationStore,
  loginValidationStore,
} = require("../validation/validation.store.data");

dotenv.config();
const MESSAGE_CLIENT = require("twilio")(
  process.env.SMS_API_SID,
  process.env.SMS_API_TOKEN
);
// get all the user
const GET_ALL_STORE = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(400).json({ error: "Cannot fetch any data!" });
  }
};
// Get a specific user
const FIND_ONE_STORE = async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    res.json(store);
  } catch (err) {
    res.json({ error: "No store found!" });
  }
};

// Create a new user
const CREATE_NEW_STORE = async (req, res) => {
  // Validate Regsitration input
  const { error } = registerValidationStore(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check list number
  const count = await Store.find();

  // Check email if already existing to the datbase
  const checkEmailExist = await Store.findOne({ email: req.body.email });
  if (checkEmailExist)
    return res.status(400).json({ error: "Email already in used!" });

  // Hasing password using Bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // generate random otp numbers
  const myOTP = otpGenerator.generate(6);
  // generate random user id
  const accountType = "store";
  // generate random chars

  try {
    const urls = [];
    const uploader = async (path) =>
      await cloudinary.uploader.upload(path, {
        folder: "store_permit",
      });

    const files = req.files;
    if (req.method === "POST") {
      for (const file of files) {
        const { path } = file;

        const newPath = await uploader(path);
        urls.push(newPath.url);
      }
    } else {
      res.status(405).json({
        errorr: "Images not uploaded successfully",
      });
    }
    const gallery = [];
    const serviceDone = 0;

    const store = new Store({
      id: count.length + 1,
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
      isValidated: req.body.isValidated,
      profileURL: req.body.profileURL,
      coverPhotoURL: req.body.coverPhotoURL,
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      rating: req.body.rating,
      fullyVerified: req.body.fullyVerified,
      services: req.body.services,
      permit: urls,
      gallery: gallery,
      serviceDone: serviceDone,
    });
    const saveNewUser = await store.save();
    // send sms otp numbers
    if (saveNewUser) {
      try {
        MESSAGE_CLIENT.messages.create({
          body: `This is your OTP from Find-talyer App: ${myOTP}`,
          from: "+19316503399",
          to: `+63${req.body.contactNo}`,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    res.status(200).json(saveNewUser);
  } catch (err) {
    res.status(400).json({ error: "Failed to register!" });
    console.log(err.message);
  }
};

// Login the store
const LOGIN_STORE = async (req, res) => {
  const { error } = loginValidationStore(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    // Check email if already existing to the database
    const store = await Store.findOne({ email: req.body.email });
    const validated = store.isValidated;
    const validPassword = await bcrypt.compare(
      req.body.password,
      store.password
    );
    if (!store || !validPassword) {
      return res.status(400).json({ error: "Invalid email or password!" });
    } else if (validated === false) {
      return res.status(400).json({ error: "Please validate your account!" });
    }
    // Password is Correct
    // create and assigned token
    const token = jwt.sign({ _id: store._id }, process.env.TOKEN_SECRET);
    res.header("authtoken", token).json({
      userID: store._id,
      userType: store.accountType,
      storeLatitude: store.latitude,
      storeLongitude: store.longitude,
      userToken: token,
    });
  } catch (err) {
    res.status(400).json({ error: "Failed to login!" });
  }
};
// update userdata

const UPDATE_STORE_DATA = async (req, res) => {
  try {
    const updateUserData = await Store.updateOne(
      { _id: req.params.storeId },
      {
        $set: {
          firstname: req.body.firstname.trim(),
          lastname: req.body.lastname.trim(),
          middlename: req.body.middlename.trim(),
          gender: req.body.gender,
          age: req.body.age,
          storeName: req.body.storeName.trim(),
          storeAddress: req.body.storeAddress.trim(),
          email: req.body.email.trim(),
          contactNo: req.body.contactNo,
          isValidated: req.body.isValidated,
        },
      }
    );
    res.status(200).json({ message: "Updated Successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Unexpected error occured. Try again!" });
  }
};

// Validate account
const VALIDATE_ACCOUNT = async (req, res) => {
  const store = await Store.findOne({ email: req.body.email });
  if (store) {
    if (req.body.otpUsed === store.otpUsed) {
      try {
        const validate = await Store.updateOne(
          { _id: req.params.storeId },
          {
            $set: {
              isValidated: true,
            },
          }
        );
        res.status(200).json({ message: "Verified!" });
      } catch (error) {
        res.status(400).json({ error: "Unexpected error occured. Try again!" });
      }
    } else {
      res.status(400).json({ error: "Wrong OTP!" });
    }
  } else {
    res.status(400).json({ error: "Unexpected error occured. Try again!" });
  }
};
//  Resend Otp
const RESEND_OTP = async (req, res) => {
  const store = await Store.findOne({ email: req.body.email });
  if (store) {
    try {
      // generate random otp numbers
      const myOTP = otpGenerator.generate(6);
      const updateOtpUsed = await Store.updateOne(
        { _id: req.params.storeId },
        { $set: { otpUsed: myOTP } }
      );
      if (updateOtpUsed) {
        try {
          MESSAGE_CLIENT.messages.create({
            body: `This is your OTP from Find-talyer App: ${myOTP}`,
            from: "+19316503399",
            to: `+63${store.contactNo}`,
          });
        } catch (error) {
          console.log(error.message);
        }
      }
      res.status(200).json({ message: "Resend Successfully!" });
    } catch (error) {
      res.status(400).json({ error: "Unexpected error occured. Try again!" });
    }
  } else {
    res.status(400).json({ error: "Unexpected error occured. Try again!" });
  }
};
// Reset password and sending email otp for verification
// Check first if the given gmail
const FIND_USER_BY_EMAIL = async (req, res) => {
  // Check email if already existing to the database
  const store = await Store.findOne({ email: req.body.email });
  if (!store) {
    return res.status(400).json({ error: "Email is not existing!" });
  } else if (store.otpUsed === null) {
    return res.status(400).json({ error: "Password cannot be reset!" });
  } else {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FIND_TALYER_EMAIL,
        pass: process.env.FIND_TALYER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.FIND_TALYER_EMAIL,
      to: req.body.email,
      subject: "RESET PASSORD - CODE VERIFFICATION",
      text: `VERIFICATION CODE for Reseting your Password: ${store.otpUsed}`,
    };
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        return res
          .status(400)
          .json({ error: "Failed to send Verification Code!" });
      } else {
        return res
          .status(200)
          .send(store)
          .json({ message: "successfully send!" });
      }
    });
  }
};
// Reset Password

const RESET_PASSWORD = async (req, res) => {
  // Check email if already existing to the database
  const store = await Store.findOne({ email: req.body.email });
  if (!store) {
    return res.status(400).json({ error: "No user found!" });
  } else if (store.otpUsed !== req.body.otpUsed) {
    return res.status(400).json({ error: "Invalid verfication code!" });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const updateUserPassword = await Store.updateOne(
      { _id: req.params.storeId },
      { $set: { password: hashedPassword } }
    );

    if (!updateUserPassword) {
      return res.status(400).json({ error: "Failed to reset password!" });
    } else {
      return res
        .status(200)
        .json({ message: "Password successfully reseted!" });
    }
  }
};

// upload profile
const UPLOAD_PROFILE_STORE = async (req, res) => {
  const { user } = req;
  console.log(user);
  if (!user) return res.status(401).json({ error: "anuathorized access!" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "store_profile",
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });

    await Store.findByIdAndUpdate(
      user._id,
      { profileURL: result.url },
      { useFindAndModify: false }
    );

    res.status(200).json({ message: "Profile picture has updated!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error!" });
  }
};

// upload profile
const UPLOAD_COVER_PHOTO = async (req, res) => {
  const { user } = req;
  console.log(user);
  if (!user) return res.status(401).json({ error: "anuathorized access!" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "store_cover_photo",
      public_id: `${user._id}_cover`,
      width: 640,
      height: 315,
      crop: "fill",
    });

    await Store.findByIdAndUpdate(
      user._id,
      { coverPhotoURL: result.url },
      { useFindAndModify: false }
    );

    res.status(200).json({ message: "Cover Photo has updated!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

const SEARCH_SERVICE = async (req, res) => {
  try {
    const stores = await Store.find({
      services: { $regex: req.query.service, $options: "i" },
    });
    if (stores) {
      res.status(200).json(stores);
    }
  } catch (err) {
    res.status(400).json({ error: "Failed to search services!" });
  }
};

const GALLERY_UPLOAD = async (req, res) => {
  const store = await Store.findById(req.params.storeId);
  try {
    const urls = [];
    const uploader = async (path) =>
      await cloudinary.uploader.upload(path, {
        folder: "store_gallery",
      });

    const files = req.files;
    if (req.method === "POST") {
      for (const file of files) {
        const { path } = file;

        const newPath = await uploader(path);
        urls.push(newPath.url);
      }
    } else {
      res.status(405).json({
        errorr: "Images not uploaded successfully",
      });
    }
    const uploadToGallery = await Store.updateOne(
      { _id: req.params.storeId },
      { $set: { gallery: [...urls, ...store.gallery] } }
    );
    if (uploadToGallery) {
      res.status(200).json({ message: "Uploaded successfully!" });
    }
  } catch (err) {
    res.status(400).json({ error: "Failed to Upload image!" });
  }
};

// update fully verified
const UPDATE_FULLY_VERIFIED = async (req, res) => {
  try {
    const fullyVerifyStore = await Store.updateOne(
      { _id: req.params.storeId },
      {
        $set: {
          fullyVerified: true,
        },
      }
    );

    if (fullyVerifyStore) {
      res.status(200).json({ message: "Store is fully verified now" });
    }
  } catch (error) {
    res.status(400).json({ error: "Something went wrong on verification!" });
  }
};

// update number of service done
const UPDATE_NO_SERVICE_DONE = async (req, res) => {
  try {
    const findone = await Store.find({ _id: req.params.storeId });

    const count = findone[0].serviceDone;
    const updateUserData = await Store.updateOne(
      { _id: req.params.storeId },
      {
        $set: {
          serviceDone: count + 1,
        },
      }
    );
    res.status(200).json({ message: "Service Done!" });
  } catch (error) {
    res.send(400).json({ error: "Something went wrong!" });
  }
};
module.exports = {
  SEARCH_SERVICE,
  GET_ALL_STORE,
  FIND_ONE_STORE,
  CREATE_NEW_STORE,
  LOGIN_STORE,
  UPDATE_STORE_DATA,
  VALIDATE_ACCOUNT,
  RESEND_OTP,
  FIND_USER_BY_EMAIL,
  RESET_PASSWORD,
  UPLOAD_PROFILE_STORE,
  UPLOAD_COVER_PHOTO,
  GALLERY_UPLOAD,
  UPDATE_FULLY_VERIFIED,
  UPDATE_NO_SERVICE_DONE,
};
