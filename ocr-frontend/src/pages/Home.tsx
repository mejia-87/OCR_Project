import { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";

import { toast } from "sonner";

import PdfUploader from "../components/PdfUploader";
import PdfViewer from "../components/PdfViewer";
import LetterForm from "../components/LetterForm";

import type { LetterForm as LetterFormType } from "../types/letter";
import type { OCRArea } from "../types/ocr";

import Logo from "../assets/logoFAyCH.png";

const LOGO_FAyCH = Logo;
const API_URL = import.meta.env.VITE_API_URL;

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
                reject(new Error("No se pudo generar imagen"));

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
    const [file, setFile] = useState<File | null>(null);
    const [selectedField, setSelectedField] = useState<keyof LetterFormType | null>(null);

    const [form, setForm] = useState<LetterFormType>({
        referencia: "",
        cite: "",
        sidoc: "",
        fecha: "",
        receptor: "",
        emisor: "",
    });

    const handleChange = (field: keyof LetterFormType, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleSelection = async (area: OCRArea) => {
        try {
            if (!selectedField) {
                toast.warning("Selecciona un campo del formulario para asignar el texto extraído");
                return;
            }

            const imageBlob = await cropCanvasArea(area);
            //const url = URL.createObjectURL(imageBlob);
            //window.open(url);

            const formData = new FormData();

            formData.append(
                "image",
                imageBlob,
                "selection.png"
            );

            const response = await axios.post(`${API_URL}/ocr/extract`, formData);

            const text = response.data.text;

            setForm((prev) => ({
                ...prev,
                [selectedField]: text,
            }));

        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al extraer el texto");
        }
    };

    const saveLetter = async () => {
        try {
            await axios.post(`${API_URL}/letters/create`, form);
            toast.success("Carta guardada Correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al guardar la carta");
        }
    }

    return (
        <div className="bg-gray-100">
            <header className="mb-6 bg-linear-to-r from-blue-950 to-blue-800 p-4 text-white flex justify-between items-center min-h-30">
                <h1 className="text-3xl font-bold">Sistema de Gestión Documental FAyCH</h1>
                <img
                    src={LOGO_FAyCH}
                    alt="Logo FAyCH"
                    className="w-23 self-start"
                />
            </header>
            <div className="min-h-screen p-6 ">
                <div className="p-4 bg-white flex justify-between items-center">
                    <h2 className="text-3xl font-sans font-medium mb-4 text-[#021521] leading-[1em] border-b-3 border-[#021521] inline-block pb-1">
                        Configuración de Registro
                    </h2>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        id="pdf-upload"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                setFile(file);
                            }
                        }}
                    />
                    <label
                        htmlFor="pdf-upload"
                        className="relative group cursor-pointer"
                    >
                        <Upload
                            size={50}
                            strokeWidth={1}
                            className="
                                text-[#021521]
                                transition
                                hover:scale-110"
                        />

                        <span
                            className="
                                absolute
                                right-0
                                top-full
                                mt-2
                                whitespace-nowrap
                                rounded-md
                                px-3
                                py-1
                                text-sm
                                text-[#021521]
                                opacity-0
                                transition-opacity
                                group-hover:opacity-100
                            "
                        >
                            Subir nuevo documento
                        </span>
                    </label>
                </div>
                <div className="grid grid-cols-12 gap-6 bg-white">
                    <div className="col-span-4 bg-white rounded p-6">
                        <LetterForm
                            form={form}
                            selectedField={selectedField}
                            setSelectedField={setSelectedField}
                            onChange={handleChange}
                            saveLetter={saveLetter}
                        />
                    </div>

                    <div className="col-span-8 bg-white p-6">
                        {!file ? (
                            <div className="flex justify-center items-center h-full">
                                <PdfUploader
                                    onFileSelect={setFile}
                                />
                            </div>
                        ) : (
                            <PdfViewer
                                file={file}
                                onOCRSelection={handleSelection}
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}