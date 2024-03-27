const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const driveUpload = require("../middleware/drive-upload");
const postsController = require("../controllers/posts");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split("/")[0];
  if (type === "image" || type === "video") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter: fileFilter,
});

router.get("/feed", checkAuth, postsController.get_feed);

router.get(
  "/userposts/:username",
  checkAuth,
  postsController.get_profile_posts
);

router.post(
  "/",
  checkAuth,
  upload.single("postmedia"),
  driveUpload,
  postsController.post
);

router.delete("/delete/:postid", checkAuth, postsController.delete);

router.get("/like/:postid", checkAuth, postsController.like);

router.get("/dislike/:postid", checkAuth, postsController.dislike);

module.exports = router;
