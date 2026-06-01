import { useState } from "react";
import axios from "axios";

import PdfUploader from "../components/PdfUploader";
import PdfViewer from "../components/PdfViewer";
import LetterForm from "../components/LetterForm";

import type { LetterForm as LetterFormType } from "../types/letter";
import type { OCRArea } from "../types/ocr";

const cropCanvasArea = async (area: OCRArea): Promise<Blob> => {
    const pdfCanvas = document.querySelector(
        ".react-pdf__Page canvas"
    ) as HTMLCanvasElement;

    if (!pdfCanvas) {
        throw new Error(
            "Canvas PDF no encontrado"
        );
    }

    const tempCanvas = document.createElement("canvas");

    tempCanvas.width = Math.abs(area.width);
    tempCanvas.height = Math.abs(area.height);

    const ctx = tempCanvas.getContext("2d");

    if (!ctx) {
        throw new Error(
            "No se pudo obtener contexto"
        );
    }

    const scaleX = pdfCanvas.width / pdfCanvas.clientWidth;
    const scaleY = pdfCanvas.height / pdfCanvas.clientHeight;
    const realX = area.x * scaleX;
    const realY = area.y * scaleY;
    const realWidth = area.width * scaleX;
    const realHeight = area.height * scaleY;

    ctx.drawImage(
        pdfCanvas,
        realX,
        realY,
        realWidth,
        realHeight,
        0,
        0,
        realWidth,
        realHeight
    );

    return new Promise((resolve, reject) => {
        tempCanvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error(
                    "No se pudo generar imagen"
                )
                );
                return;
            }

            resolve(blob);
        },
            "image/png"
        );
    }
    );
};

export default function Home() {
    const [file, setFile] =
        useState<File | null>(null);

    const [selectedField, setSelectedField] =
        useState<keyof LetterFormType | null>(
            null
        );

    const [form, setForm] =
        useState<LetterFormType>({
            referencia: "",
            cite: "",
            sidoc: "",
            fecha: "",
            receptor: "",
            emisor: "",
        });

    const handleChange = (
        field: keyof LetterFormType,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleSelection = async (area: OCRArea) => {
        try {
            if (!selectedField) {
                alert(
                    "Seleccione un campo"
                );
                return;
            }

            const imageBlob = await cropCanvasArea(area);
            const url = URL.createObjectURL(imageBlob);
            window.open(url);

            const formData = new FormData();

            formData.append(
                "image",
                imageBlob,
                "selection.png"
            );

            const response = await axios.post("http://localhost:3000/api/ocr/extract", formData);

            const text = response.data.text;

            setForm((prev) => ({
                ...prev,
                [selectedField]: text,
            }));

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-slate-50">

            <div className="mb-6">
                <PdfUploader
                    onFileSelect={setFile}
                />
            </div>

            {file && (
                <div className="grid grid-cols-12 gap-6">

                    <div className="col-span-4 bg-white rounded-lg shadow p-4">

                        <LetterForm
                            form={form}
                            selectedField={
                                selectedField
                            }
                            setSelectedField={
                                setSelectedField
                            }
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-span-8 bg-white rounded-lg shadow p-4">

                        <PdfViewer
                            file={file}
                            onOCRSelection={
                                handleSelection
                            }
                        />

                    </div>

                </div>
            )}
        </div>
    );
}