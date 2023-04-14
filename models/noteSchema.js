const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    userID: { type: String },
    username: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const noteModel = mongoose.model("Note", noteSchema);

module.exports = noteModel;
