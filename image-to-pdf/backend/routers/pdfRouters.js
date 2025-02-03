const express = require("express");
const multer  = require("multer");

const { convertImageToPDF } = require("../controllers/convertImageToPDF")
const router = express.Router();
const upload = multer({dest: "uploads/"});

router.post("/convert",  upload.any(), convertImageToPDF);

module.exports = router;