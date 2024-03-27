const { Deta } = require("deta");
const { default: mongoose } = require("mongoose");

const deta = Deta();
const drive = deta.Drive("uploads");

module.exports = async (req, _, next) => {
  if (req.file) {
    req.file.originalname =
      new mongoose.Types.ObjectId().toString() + req.file.originalname;
    await drive.put(req.file.originalname, {
      data: req.file.buffer,
    });
  }
  next();
};
