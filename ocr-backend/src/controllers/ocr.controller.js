const fs = require("fs");
const path = require("path");

const sharp = require("sharp");

const Tesseract = require("tesseract.js");

const { fromPath } = require("pdf2pic");

exports.extractText = async (req, res) => {
    try {
        console.log("1. Inicio");
        const x = Number(req.body.x);
        const y = Number(req.body.y);
        const width = Number(req.body.width);
        const height = Number(req.body.height);

        console.log("2. Coordenadas", {
      x,
      y,
      width,
      height,
    });
        const pdfPath = req.file.path;
        console.log("3. PDF recibido:", pdfPath);

        const converter = fromPath(pdfPath, {
            density: 300,
            savePath: "./temp",
            format: "png",
            width: 2480,
            height: 3508,
        });

        console.log("4. Converter creado");
        const page = await converter(1);

        console.log("5. PDF convertido");
        const imagePath = page.path;

        console.log("6. Imagen:", imagePath);

        const cropPath = path.join(
            "temp",
            `crop-${Date.now()}.png`
        );

        await sharp(imagePath)
            .extract({
                left: Math.round(x),
                top: Math.round(y),
                width: Math.round(width),
                height: Math.round(height),
            })
            .toFile(cropPath);

        const result =
            await Tesseract.recognize(
                cropPath,
                "spa"
            );

        const text =
            result.data.text.trim();

        fs.unlinkSync(pdfPath);
        fs.unlinkSync(imagePath);
        fs.unlinkSync(cropPath);

        return res.json({
            text,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error OCR",
        });
    }
};