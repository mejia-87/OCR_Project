import { useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import type { OCRArea } from "../types/ocr";

type Props = {
  width: number;
  height: number;
  onSelectionComplete: (
    area: OCRArea
  ) => void;
};

export default function OcrSelectionLayer({
  width,
  height,
  onSelectionComplete,
}: Props) {
  const [isDrawing, setIsDrawing] = useState(false);

  const [rectangle, setRectangle] = useState<OCRArea | null>(null);

  const [startPoint, setStartPoint] = useState({ x: 0, y: 0, });


  const handleMouseDown = (e: any) => {

    const pos = e.target.getStage()?.getPointerPosition();

    if (!pos) return;

    setStartPoint(pos);

    setRectangle({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });

    setIsDrawing(true);
  };

  const handleMouseMove = (e: any) => {

    if (!isDrawing) return;

    const pos = e.target.getStage()?.getPointerPosition();

    if (!pos) return;

    setRectangle((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        width: pos.x - startPoint.x,
        height: pos.y - startPoint.y,
      };

    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    const rect = rectangle;

    if (!rect) return;

    const normalized = {
      x: rect.width < 0 ? rect.x + rect.width : rect.x,

      y: rect.height < 0 ? rect.y + rect.height : rect.y,

      width: Math.abs(rect.width),

      height: Math.abs(rect.height),
    };

    onSelectionComplete(normalized);
  };

  return (
    <Stage
      className="border-2 border-blue-700"
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Layer>
        {rectangle && (
          <Rect
            x={rectangle.x}
            y={rectangle.y}
            width={rectangle.width}
            height={rectangle.height}
            stroke="red"
            strokeWidth={2}
          />
        )}
      </Layer>
    </Stage>
  );
}