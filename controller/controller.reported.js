const Report = require("../models/model.reported");

// get all reported post
const GET_ALL_REPORTED_POST = async (req, res) => {
  try {
    const allReportedPost = await Report.find();

    if (allReportedPost) {
      res.status(200).json(allReportedPost);
    }
  } catch (error) {
    res.send(400).json({ error: "No data was found!" });
  }
};


//save the reported ID post

const SAVE_REPORTED_POST_ID = async (req, res) => {
  try {
    const reportedPost = await Report.findOne({
      reportPostId: req.body.reportPostId,
    });

    const report = new Report({
      reportPostId: req.body.reportPostId,
      isReported: true,
    });

    if (reportedPost) {
      res.status(200).json({ error: "Reported already!" });
    } else {
      const saveReport = await report.save();
      res.status(200).json({ message: "Reported post successfully!" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  SAVE_REPORTED_POST_ID,
  GET_ALL_REPORTED_POST
};
