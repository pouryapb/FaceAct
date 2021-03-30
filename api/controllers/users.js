const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "user exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              username: req.body.username,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "user created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.login = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2h",
            }
          );
          return res.status(200).json({
            message: "auth successful",
            token: token,
            requests: user[0].requests,
            followings: user[0].followings,
          });
        }
        res.status(401).json({
          message: "auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.search = (req, res, next) => {
  const usernameRegex = new RegExp(req.params.username + ".*", "i");
  console.log(usernameRegex);

  User.find({ username: usernameRegex })
    .select("username firstName lastName avatar")
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_user_info_public = (req, res, next) => {
  const username = req.params.username;

  User.find({ username: username })
    .select(
      "avatar username firstName lastName posts followings followers requests"
    )
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      res.status(200).json(user[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_user_info_private = (req, res, next) => {
  const username = req.params.username;
  if (username !== req.userData.username) {
    return res.status(401).json({
      message: "auth failed",
    });
  }
  User.find({ username: username })
    .select(
      "avatar username firstName lastName posts followings followers requests email"
    )
    .then((user) => {
      res.status(200).json(user[0]);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.patch_user_info = (req, res, next) => {
  const username = req.params.username;
  if (username !== req.userData.username) {
    return res.status(401).json({
      message: "auth failed",
    });
  }
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.updateOne({ username: username }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.patch_avatar = (req, res, next) => {
  const username = req.params.username;
  if (username !== req.userData.username) {
    return res.status(401).json({
      message: "auth failed",
    });
  }
  User.updateOne({ username: username }, { $set: { avatar: req.file.path } })
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.send_request = (req, res, next) => {
  const reciver = req.params.username;
  const sender = req.userData.username;
  User.find({ username: reciver, requests: sender })
    .exec()
    .then((result) => {
      if (result.length > 0 && result[0].request) {
        res.status(409).json({
          message: "already requested",
        });
        return;
      }
    })
    .then(() => {
      User.updateOne({ username: reciver }, { $push: { requests: sender } })
        .exec()
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
};

exports.accept_request = (req, res, next) => {
  const reciver = req.params.username;
  const sender = req.userData.username;
  User.updateOne(
    { username: reciver },
    { $push: { followings: sender } }
  ).exec();
  User.updateOne(
    { username: sender },
    { $pull: { requests: reciver }, $push: { followers: reciver } }
  )
    .exec()
    .then((user) => {
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

exports.unsend_request = (req, res, next) => {
  const reciver = req.params.username;
  const sender = req.userData.username;
  User.updateOne({ username: reciver }, { $pull: { requests: sender } })
    .exec()
    .then((user) => {
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

exports.unfriend = (req, res, next) => {
  const reciver = req.params.username;
  const sender = req.userData.username;
  User.updateOne(
    { username: reciver },
    { $pull: { followers: sender } }
  ).exec();
  User.updateOne({ username: sender }, { $pull: { followings: reciver } })
    .exec()
    .then((user) => {
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

exports.deny_request = (req, res, next) => {
  const reciver = req.params.username;
  const sender = req.userData.username;
  User.updateOne({ username: sender }, { $pull: { requests: reciver } })
    .exec()
    .then((user) => {
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
