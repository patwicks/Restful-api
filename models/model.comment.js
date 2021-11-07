const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    member: {
      type: Array,
    },
    commenterName: {
      type: String,
    },
    commenterProfile: {
      type: String,
    },
    commenterUserType: {
      type: String,
    },
    commenterPostText: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
