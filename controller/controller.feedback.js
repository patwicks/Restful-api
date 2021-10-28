const Feedback = require("../models/model.feedback");
const Store = require("../models/model.store");

const CREATE_FEEDBACK = async (req, res) => {
  const newFeedback = new Feedback({
    members: [req.body.driverId, req.body.storeId],
    name: req.body.name,
    feedback: req.body.feedback,
    rate: req.body.rate,
    profile: req.body.profile,
  });
  const find = await Store.findById(req.body.storeId);
  const plusTotalRating = parseInt(find.rating) + parseInt(req.body.rate);

  const updateRating = await Store.updateOne(
    { _id: req.body.storeId },
    { $set: { rating: plusTotalRating } }
  );
  try {
    const saveFeedback = await newFeedback.save();
    if (saveFeedback) {
      res.status(200).json(saveFeedback);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create feedback!" });
  }
};

//   GET THE SPECIFIC USER CONVERSATION
const GET_ALL_FEEDBACKS = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      members: { $in: [req.params.storeId] },
    });
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  CREATE_FEEDBACK,
  GET_ALL_FEEDBACKS,
};
