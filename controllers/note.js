const jwt = require("jsonwebtoken");
const NoteModel = require("../models/noteSchema");
const SECRET_KEY = "asdfghjklkjhgfdsa";
const PDFDocument = require("pdfkit");

const getUserByToken = (token) => {
  return new Promise((res, rej) => {
    let userDetail;
    if (token) {
      try {
        userDetail = jwt.verify(token, SECRET_KEY);
        res(userDetail);
      } catch (err) {
        rej("Invalid token");
      }
    } else {
      rej("Token not found");
    }
  });
};

exports.getNotes = async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  if (user) {
    try {
      const notes = await NoteModel.find({ userID: user.userID });
      res.status(200).json(notes);
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message:
          "Could not able to fetch the notes. Please try again after sometime!",
      });
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
};

exports.getNotesById = async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  const id = req.params.id;
  if (user) {
    try {
      const note = await NoteModel.findOne({
        _id: id,
      });
      res.status(200).json(note);
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message:
          "Could not able to fetch the note. Please try again after sometime!",
      });
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
};

exports.getNotesBySearch = async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  const search = req.params.search;
  if (user) {
    try {
      const note = await NoteModel.find({
        title: { $regex: new RegExp(`^${search}`, "i") },
      });
      res.status(200).json(note);
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message:
          "Could not able to fetch the note. Please try again after sometime!",
      });
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
};

exports.postAddNote = async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  if (user) {
    try {
      const note = await NoteModel.create({
        userID: user.userID,
        username: user.username,
        title: req.body.title,
        description: req.body.description,
      });
      res.status(200).json({
        status: "Success",
        note,
      });
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message: "Something went wrong!",
      });
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Please login to add note!",
    });
  }
};

exports.updateNote = async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  const id = { _id: req.params.id };
  if (user) {
    try {
      await NoteModel.updateOne(id, req.body);
      res.status(200).json({
        status: "Success",
        message: "Note updated successfully.",
      });
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message: err.message,
      });
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Please login to update note!",
    });
  }
};

exports.deleteAllNotes = async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  if (user) {
    try {
      await NoteModel.deleteMany({ userID: user.userID });
      res.status(200).json({
        status: "Success",
        message: "All notes deleted successfully.",
      });
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message: err.message,
      });
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Please login to delete notes!",
    });
  }
};

exports.deleteNote = async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  const id = { _id: req.params.id };
  if (user) {
    try {
      await NoteModel.deleteOne(id);
      res.status(200).json({
        status: "Success",
        message: "Note deleted successfully.",
      });
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message: err.message,
      });
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Please login to delete note!",
    });
  }
};

exports.exportNotesInPdf = async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  if (user) {
    try {
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(res);
      const notes = await NoteModel.find({ userID: user.userID });
      pdfDoc.fontSize(24).text("All Notes", { align: "center" });
      pdfDoc.text("***********", { align: "center" });
      if (notes.length !== 0) {
        let i = 0;
        notes.forEach((note) => {
          i++;
          pdfDoc
            .fillColor("#b602e7")
            .fontSize(15)
            .text(`Note ${i}`, { align: "center" });
          pdfDoc.moveUp(0.3);
          pdfDoc.text("=====", { align: "center" });
          pdfDoc.moveDown(0.5);
          pdfDoc
            .fillColor("#067cb6")
            .fontSize(16)
            .text(note.title, { align: "center" });
          pdfDoc.moveDown(0.5);
          pdfDoc
            .fillColor("#343a40")
            .fontSize(12)
            .text(note.description, { align: "justify" });
          pdfDoc.text(
            "                                                                                                                                            ",
            { underline: true }
          );
          pdfDoc.moveDown(0.5);
        });
      } else {
        pdfDoc
          .fontSize(20)
          .text("No notes were added till now!", { align: "center" });
      }
      pdfDoc.end();
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message: err.message,
      });
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Please login to exports notes in PDF!",
    });
  }
};
