const express = require("express");
const multer = require("multer");

const {
    extractText,
} = require("../controllers/ocr.controller");

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

router.post(
    "/extract",
    upload.single("pdf"),
    extractText
);

module.exports = router;