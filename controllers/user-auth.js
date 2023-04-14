const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserAuthModel = require("../models/userSchema");
const {
  rndmTwoDigNum,
  rndmFourDigNum,
  rndmFiveDigNum,
} = require("../utils/math");
const saltRounds = 10;
const SECRET_KEY = "asdfghjklkjhgfdsa";

exports.postSignUp = async (req, res) => {
  bcrypt.genSalt(saltRounds, (saltError, saltValue) => {
    if (!saltError) {
      bcrypt.hash(
        req.body.password,
        saltValue,
        async (hashError, hashValue) => {
          if (!hashError) {
            try {
              const userId = `${rndmTwoDigNum()}NTK${rndmFiveDigNum()}`;
              const user = await UserAuthModel.create({
                userID: userId,
                username: `${req.body.email.split("@")[0]}-${
                  userId.split("NTK")[0]
                }${userId.split("NTK")[1]}`,
                email: req.body.email,
                password: hashValue,
              });
              res.status(200).json({
                status: "Success",
                user,
              });
            } catch (err) {
              res.status(400).json({
                status: "Failed",
                message: "User already exists. Please login to continue.",
              });
            }
          } else {
            res.status(400).json({
              status: "Failed",
              message: "Failed to store the data",
            });
          }
        }
      );
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Failed store the data",
      });
    }
  });
};

exports.postSignIn = async (req, res) => {
  try {
    const userDetail = await UserAuthModel.findOne({ email: req.body.email });
    if (!userDetail) {
      res.status(400).json({
        status: "SignIn Unsuccessful",
        message: "User does not exist. Please sign up.",
      });
    } else {
      if (bcrypt.compareSync(req.body.password, userDetail.password)) {
        const token = jwt.sign(
          {
            id: userDetail._id,
            userID: userDetail.userID,
            username: userDetail.username,
          },
          SECRET_KEY
        );
        res.status(200).json({
          status: "SignIn Successful",
          message: "User Logged in successfully.",
          token,
        });
      } else {
        res.status(400).json({
          status: "Invalid Password",
          message:
            "Invalid Password! Please enter a correct password to login!",
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};
