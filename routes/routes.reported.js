const router = require("express").Router();
const { SAVE_REPORTED_POST_ID } = require("../controller/controller.reported");

router.post("/", SAVE_REPORTED_POST_ID);
module.exports = router;
