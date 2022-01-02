const mongoose = require("mongoose");

const ReportPostSchema = new mongoose.Schema({
  reportPostId: {
    type: String,
  },
  isReported: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Report", ReportPostSchema);
