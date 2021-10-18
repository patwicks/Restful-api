const mongoose = require("mongoose");

const requestServiceSchema = new mongoose.Schema({
  transactionMember: {
    type: Array,
    required: true,
  },
  attachedImages: {
    type: Array,
  },
  selectedServices: {
    type: Array,
  },
  statementMessage: {
    type: String,
    required: true,
  },
  transactionStatus: {
    type: String,
    required: true,
  },
  driverLatitude: {
    type: Number,
    required: true,
  },
  driverLongitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Request", requestServiceSchema);
