const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userName: {
      type: String,
    },
    userProfile: {
      type: String,
    },
    userPostText: {
      type: String,
    },
    userPostImage: {
      type: Array,
    },
    userType: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
