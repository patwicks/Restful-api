const Message = require("../models/model.message");
const cloudinary = require("../utility/utility.cloudinary");
const crypto = require("crypto");

// add message

const ADD_MESSAGE_IMG_TEXT = async (req, res) => {
  const random = crypto.randomBytes(20).toString("hex");
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "message_image",
      public_id: `${random}_image`,
    });
    const img = result.url;
    const newMessage = new Message({
      conversationId: req.body.conversationId,
      sender: req.body.sender,
      text: req.body.text.trim(),
      image: img,
    });

    const savedMessage = await newMessage.save();

    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

const ADD_PLAIN_MESSAGE = async (req, res) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    sender: req.body.sender,
    text: req.body.text.trim()
  });
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

//   get the messages

const GET_MESSAGE = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  ADD_MESSAGE_IMG_TEXT,
  ADD_PLAIN_MESSAGE,
  GET_MESSAGE,
};
