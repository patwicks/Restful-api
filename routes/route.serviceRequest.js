const router = require("express").Router();

const HANDLE_UPLOAD_MULTIPLE = require("../utility/utility.uploadMultipleImages");

const {
  SEND_REQUEST,
  FIND_ONE_REQUEST,
  CANCEL_REQUEST,
} = require("../controller/controller.serviceRequest");

router.post("/request", HANDLE_UPLOAD_MULTIPLE, SEND_REQUEST);
router.get("/request/:requestId", FIND_ONE_REQUEST);
router.patch("/cancel/:requestId", CANCEL_REQUEST);

module.exports = router;