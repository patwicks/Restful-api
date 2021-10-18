const router = require("express").Router();

const HANDLE_UPLOAD_MULTIPLE = require("../utility/utility.uploadMultipleImages");

const { SEND_REQUEST } = require("../controller/controller.serviceRequest");

router.post("/request", HANDLE_UPLOAD_MULTIPLE, SEND_REQUEST);

module.exports = router;
