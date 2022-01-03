const router = require("express").Router();
const {
  SAVE_REPORTED_POST_ID,
  GET_ALL_REPORTED_POST,
} = require("../controller/controller.reported");

router.post("/", SAVE_REPORTED_POST_ID);
router.get("/all", GET_ALL_REPORTED_POST);
module.exports = router;
