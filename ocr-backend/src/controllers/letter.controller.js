const prisma = require("../config/prisma");

exports.createLetter = async (req, res) => {
    try {
        const {
            referencia,
            cite,
            sidoc,
            fecha,
            receptor,
            emisor,
        } = req.body;

        const letter = await prisma.letter.create({
            data: {
                referencia,
                cite,
                sidoc,
                fecha,
                receptor,
                emisor,
            },
        });

        return res.status(201).json({
            success: true,
            data: letter,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al guardar Carta: " + error.message,
        });
    }
};