const fs = require("fs");
const Tesseract = require("tesseract.js");

exports.extractText = async (req, res) => {
    try {
      const result = await Tesseract.recognize(req.file.path, "spa");

      const text = result.data.text.trim();

      fs.unlinkSync(req.file.path);

      return res.json({ text, });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Error OCR",
      });
    }
  };