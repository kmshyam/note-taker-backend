const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userAuthSchema = new Schema(
  {
    userID: { type: String, unique: true },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserAuthModel = mongoose.model("User", userAuthSchema);

module.exports = UserAuthModel;
