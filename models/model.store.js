const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  accountType: {
    type: String,
  },
  firstname: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  lastname: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  middlename: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
    min: 2,
    max: 3,
  },
  storeName: {
    type: String,
    required: true,
    max: 255,
  },
  storeAddress: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 15,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  contactNo: {
    type: String,
    required: true,
    min: 10,
    max: 10,
  },
  otpUsed: {
    type: String,
  },
  isValidated: {
    type: Boolean,
    required: true,
  },
  dateOfRegistration: {
    type: Date,
    default: Date.now(),
  },
  profileURL: {
    type: String,
  },
  coverPhotoURL: {
    type: String,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  fullyVerified: {
    type: Boolean,
    required: true,
  },
  services: {
    type: Array,
  },
  permit: {
    type: Array,
  },
  gallery: {
    type: Array,
  },
  id: {
    type: Number,
  },
  serviceDone: {
    type: Number,
  },
});

module.exports = mongoose.model("Store", storeSchema);
