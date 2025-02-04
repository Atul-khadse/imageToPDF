const express = require("express");
const multer = require("multer");
const { uploadAudio, getAllTranscription } = require("../controllers/transcript.controller");

const router = express.Router();
const upload = multer({dest: "uploads/"});

router.post("/upload",upload.single("file"), uploadAudio);
router.get("/transcriptions", getAllTranscription);

module.exports = router;