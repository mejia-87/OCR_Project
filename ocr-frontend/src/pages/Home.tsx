import { useState } from "react";

import PdfUploader from "../components/PdfUploader";
import PdfViewer from "../components/PdfViewer";
import LetterForm from "../components/LetterForm";

import type { LetterForm as LetterFormType } from "../types/letter";
import type { OCRArea } from "../types/ocr";

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

    const handleOCRResult = (
        text: string
    ) => {
        if (!selectedField) {
            alert(
                "Seleccione primero un campo del formulario"
            );
            return;
        }

        setForm((prev) => ({
            ...prev,
            [selectedField]: text,
        }));
    };

    const handleSelection = async (area: OCRArea) => {
        if (!selectedField) {
            alert("Seleccione un campo primero");
            return;
        }

        if (!file) {
            alert("No existe PDF");
            return;
        }

        const formData = new FormData();

        formData.append("pdf", file);
        formData.append("x", area.x.toString());
        formData.append("y", area.y.toString());
        formData.append("width", area.width.toString());
        formData.append("height", area.height.toString());

        try {
            const response = await fetch(
                "http://localhost:3000/api/ocr/extract",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            setForm((prev) => ({
                ...prev,
                [selectedField]: data.text,
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