const router = require("express").Router();
const {
  POST_COMMENT,
  GET_COMMENTS,
} = require("../controller/controller.comment");

router.post("/postcomment", POST_COMMENT);
router.get("/:postId", GET_COMMENTS);
module.exports = router;
