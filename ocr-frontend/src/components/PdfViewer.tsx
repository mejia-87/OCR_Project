import { useState, useRef } from "react";
import { Document, Page, } from "react-pdf";

import OCRSelectionLayer from "./OcrSelectionLayer";
import type { OCRArea } from "../types/ocr";


type Props = {
  file: File;
  onOCRSelection: (area: OCRArea) => void;
  onPageReady?: () => void;
};

export default function PdfViewer({ file, onOCRSelection, }: Props) {

  const PDF_WIDTH = 1000;

  const [pageHeight, setPageHeight] = useState(0);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex justify-center">
      <div
        className="relative"
        ref={pdfContainerRef}
        id="pdf-container"
      >
        <Document file={file}>
          <Page
            className="border-2 border-red-600"
            pageNumber={1}
            width={PDF_WIDTH}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onRenderSuccess={() => {
              const canvas =
                document.querySelector(
                  ".react-pdf__Page canvas"
                ) as HTMLCanvasElement;

              if (canvas) {
                setPageHeight(canvas.clientHeight);
              }
            }}
          />
        </Document>

        {pageHeight > 0 && (
          <OCRSelectionLayer
            width={PDF_WIDTH}
            height={pageHeight}
            onSelectionComplete={onOCRSelection}
          />
        )}
      </div>

    </div>
  );
}