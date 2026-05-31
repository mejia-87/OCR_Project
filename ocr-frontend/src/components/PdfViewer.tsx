import { useState } from "react";
import {
  Document,
  Page,
} from "react-pdf";

import OCRSelectionLayer from "./OcrSelectionLayer";
import type  { OCRArea } from "../types/ocr";

type Props = {
  file: File;
  onOCRSelection: (
    area: OCRArea
  ) => void;
};

export default function PdfViewer({
  file,
  onOCRSelection,
}: Props) {
  const PDF_WIDTH = 1000;

  const [pageHeight, setPageHeight] =
    useState(0);

  return (
    <div className="flex justify-center">

      <div className="relative">

        <Document file={file}>
          <Page
            pageNumber={1}
            width={PDF_WIDTH}
            renderTextLayer={
              false
            }
            renderAnnotationLayer={
              false
            }
            onLoadSuccess={(
              page
            ) => {
              const viewport =
                page.getViewport({
                  scale:
                    PDF_WIDTH /
                    page.width,
                });

              setPageHeight(
                viewport.height
              );
            }}
          />
        </Document>

        {pageHeight > 0 && (
          <OCRSelectionLayer
            width={PDF_WIDTH}
            height={
              pageHeight
            }
            onSelectionComplete={
              onOCRSelection
            }
          />
        )}

      </div>

    </div>
  );
}