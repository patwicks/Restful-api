const Comment = require("../models/model.comment");

const POST_COMMENT = async (req, res) => {
  try {
    const newComment = new Comment({
      member: [req.body.postId, req.body.commenterId],
      commenterName: req.body.commenterName,
      commenterProfile: req.body.commenterProfile,
      commenterUserType: req.body.commenterUserType,
      commenterPostText: req.body.commenterPostText,
    });
    const saveNewComment = await newComment.save();
    if (saveNewComment) {
      res.status(200).json(saveNewComment);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to post a comment!" });
  }
};

//   GET THE COMMENT COLLECTION
//   GET THE SPECIFIC USER CONVERSATION
const GET_COMMENTS = async (req, res) => {
  try {
    const comments = await Comment.find({
      member: { $in: [req.params.postId] },
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json({ error: "Failed to load comments!" });
  }
};

module.exports = {
  POST_COMMENT,
  GET_COMMENTS,
};
