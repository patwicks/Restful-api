const router = require("express").Router();
const {
  ADD_CONVERSATION,
  GET_USER_CONVERSATION,
  GET_CONVERSATION_TWO,
} = require("../controller/controller.conversation");
const AUTHENTICATE = require("../middlewares/authMiddleware");

router.post("/", ADD_CONVERSATION);
router.get("/:userId", GET_USER_CONVERSATION);
router.get("/find/:firstUserId/:secondUserId", GET_CONVERSATION_TWO);

module.exports = router;
