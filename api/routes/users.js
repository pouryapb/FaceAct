const express = require("express");
const router = express.Router();
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");
const usersControlers = require("../controllers/users");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

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

router.post("/signup", usersControlers.signup);

router.post("/login", usersControlers.login);

router.get("/search/:username", usersControlers.search);

router.get("/:username", usersControlers.get_user_info_public);

router.get(
  "/uinfo/:username",
  checkAuth,
  usersControlers.get_user_info_private
);

router.patch("/uinfo/:username", checkAuth, usersControlers.patch_user_info);

router.patch(
  "/avatarup/:username",
  checkAuth,
  upload.single("avatarImg"),
  usersControlers.patch_avatar
);

router.post("/req/:username", checkAuth, usersControlers.send_request);

router.post("/reqac/:username", checkAuth, usersControlers.accept_request);

router.post("/unreq/:username", checkAuth, usersControlers.unsend_request);

router.post("/unfriend/:username", checkAuth, usersControlers.unfriend);

router.post("/reqden/:username", checkAuth, usersControlers.deny_request);

module.exports = router;
