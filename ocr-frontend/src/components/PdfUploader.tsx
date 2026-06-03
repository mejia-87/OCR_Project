import { useState } from "react";
import { Upload } from "lucide-react";

type Props = {
  onFileSelect: (file: File | null) => void;
};

export default function PdfUploader({
  onFileSelect,
}: Props) {
  const [dragging, setDragging] =
    useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => {
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();

        setDragging(false);

        const file =
          e.dataTransfer.files[0];

        if (
          file &&
          file.type ===
            "application/pdf"
        ) {
          onFileSelect(file);
        }
      }}
      className={`
        h-100
        w-175
        rounded-xl
        border-2
        border-dashed
        flex
        items-center
        justify-center
        transition-all

        ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300"
        }
      `}
    >
      <label
        htmlFor="pdf-upload"
        className="
          flex
          flex-col
          items-center
          justify-center
          w-full
          h-full
          cursor-pointer
        "
      >
        <Upload
          size={70}
          strokeWidth={1}
          className={`
            mb-4
            ${
              dragging
                ? "text-blue-500"
                : "text-slate-400"
            }
          `}
        />

        <h2 className="text-xl font-medium">
          Cargar documento PDF
        </h2>

        <p className="text-slate-500 mt-2">
          Arrastre un archivo o haga clic
        </p>

        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (file) {
              onFileSelect(file);
            }
          }}
        />
      </label>
    </div>
  );
}