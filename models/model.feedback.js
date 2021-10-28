const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    name: {
      type: String,
    },
    profile: {
      type: String,
    },
    feedback: {
      type: String,
    },
    rate: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
