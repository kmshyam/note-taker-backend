const express = require("express");
const router = express.Router();
const NoteController = require("../controllers/note");

router.get("/", NoteController.getNotes);

router.get("/:id", NoteController.getNotesById);

router.get("/search/:search", NoteController.getNotesBySearch);

router.post("/add", NoteController.postAddNote);

router.put("/edit/:id", NoteController.updateNote);

router.delete("/delete/:id", NoteController.deleteNote);

router.delete("/delete/notes/all", NoteController.deleteAllNotes);

router.get("/export/pdf", NoteController.exportNotesInPdf);

module.exports = router;
