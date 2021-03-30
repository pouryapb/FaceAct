const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  text: { type: String, required: true },
  media: String,
  mediatype: String,
  date: { type: Date, default: new Date() },
  likes: [],
});

module.exports = mongoose.model("Post", postSchema);
