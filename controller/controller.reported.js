const Report = require("../models/model.reported");

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
};
