const User = require("../models/user");
const Post = require("../models/post");
const mongoose = require("mongoose");

exports.get_feed = async (req, res, next) => {
  let posts = [];
  var user = await User.find({ username: req.userData.username });
  for (let i = 0; i <= user[0].followings.length; i++) {
    const element = i === 0 ? req.userData.username : user[0].followings[i - 1];
    var data = await Post.find({ username: element });
    var poster = await User.find({ username: element });
    for (let j = 0; j < data.length; j++) {
      const element = data[j];
      posts.push({
        post: element,
        name: poster[0].firstName + " " + poster[0].lastName,
        avatar: poster[0].avatar,
      });
    }
  }
  posts.sort((x, y) => {
    if (Date.parse(x.post.date) < Date.parse(y.post.date)) {
      return 1;
    }
    if (Date.parse(x.post.date) > Date.parse(y.post.date)) {
      return -1;
    }
    return 0;
  });
  res.status(200).json(posts);
};

exports.get_profile_posts = (req, res, next) => {
  Post.find({ username: req.params.username })
    .exec()
    .then((posts) => {
      posts.sort(function (x, y) {
        if (x < y) {
          return 1;
        }
        if (x > y) {
          return -1;
        }
        return 0;
      });
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.post = (req, res, next) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    text: req.body.text,
    media: req.file ? "uploads/" + req.file.originalname : null,
    mediatype: req.file ? req.file.mimetype.split("/")[0] : null,
    date: new Date(),
  });
  post
    .save()
    .then((result) => {
      User.updateOne(
        { username: req.userData.username },
        { $push: { posts: result._id } }
      ).exec();
      res.status(200).json({
        message: "posted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete = (req, res, next) => {
  Post.deleteOne({ _id: req.params.postid, username: req.userData.username })
    .exec()
    .then((result) => {
      res.status(200).json({});
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.like = (req, res, next) => {
  Post.updateOne(
    { _id: req.params.postid },
    { $push: { likes: req.userData.username } }
  )
    .exec()
    .then(() => {
      res.status(201).json({
        message: "ok",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.dislike = (req, res, next) => {
  Post.updateOne(
    { _id: req.params.postid },
    { $pull: { likes: req.userData.username } }
  )
    .exec()
    .then(() => {
      res.status(201).json({
        message: "ok",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
