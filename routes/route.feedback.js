const router = require("express").Router();
const {
  CREATE_FEEDBACK,
  GET_ALL_FEEDBACKS,
} = require("../controller/controller.feedback");

router.post("/create", CREATE_FEEDBACK);
router.get("/list/:storeId", GET_ALL_FEEDBACKS);

module.exports = router;
