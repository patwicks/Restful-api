const multer = require("multer");
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ error: "Invalid image file!" }, false);
  }
};
const HANDLE_UPLOAD = multer({ storage, fileFilter }).single("image");

module.exports = HANDLE_UPLOAD;
