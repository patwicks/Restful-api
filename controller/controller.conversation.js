const Conversation = require("../models/model.conversation");

// add new conversation
const ADD_CONVERSATION = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const find = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    if (find === null) {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } else {
      res.status(404).json({ error: "Room already existing!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//   GET THE SPECIFIC USER CONVERSATION
const GET_USER_CONVERSATION = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//   GET THE COVERSATION WITH TWO ID
const GET_CONVERSATION_TWO = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  ADD_CONVERSATION,
  GET_USER_CONVERSATION,
  GET_CONVERSATION_TWO,
};
