const router = require("express").Router();
const { CREATE_POST, GET_ALL_POST } = require("../controller/controller.post");
const HANDLE_UPLOAD_MULTIPLE = require("../utility/utility.uploadMultipleImages");

router.post("/create", HANDLE_UPLOAD_MULTIPLE, CREATE_POST);
router.get("/all", GET_ALL_POST);

module.exports = router;
