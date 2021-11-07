const router = require("express").Router();
const {
  ADD_MESSAGE_IMG_TEXT,
  GET_MESSAGE,
  ADD_PLAIN_MESSAGE,
} = require("../controller/controller.message");
const HANDLE_UPLOAD = require("../utility/utility.sendIMG");

router.post("/", HANDLE_UPLOAD, ADD_MESSAGE_IMG_TEXT);
router.post("/plain", ADD_PLAIN_MESSAGE);
router.get("/:conversationId", GET_MESSAGE);

module.exports = router;
