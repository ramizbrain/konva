import { useState } from "react";
import { Circle, Layer, Rect, Stage, Text } from "react-konva";

// Definisi interface untuk elemen
interface KonvaElement {
  id: number;
  type: string;
  x: number;
  y: number;
  fill: string;
  text: string;
  radius?: number;
  width?: number;
  height?: number;
}

const KonvaMultiPage = () => {
  const [elements, setElements] = useState<KonvaElement[]>([]);
  const [scale, setScale] = useState(1);

  // Tambah elemen
  const addElement = (type: string) => {
    setElements((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type,
        x: Math.random() * 200,
        y: Math.random() * 200,
        fill: type === "rect" ? "red" : type === "circle" ? "blue" : "black",
        text: type === "text" ? "New Text" : "",
        radius: type === "circle" ? 30 : undefined,
        width: type === "rect" ? 100 : undefined,
        height: type === "rect" ? 100 : undefined,
      },
    ]);
  };

  // Update posisi saat elemen di-drag
  const updateElementPosition = (id: number, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  return (
    <div className="flex flex-col items-center gap-0 overflow-clip">
      {/* Toolbar */}
      <div className="flex h-[40px] gap-2 bg-amber-900 w-full text-center">
        <button onClick={() => addElement("rect")}>Add Rect</button>
        <button onClick={() => addElement("circle")}>Add Circle</button>
        <button onClick={() => addElement("text")}>Add Text</button>
        <button onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))}>
          Zoom In
        </button>
        <button onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}>
          Zoom Out
        </button>
      </div>

      {/* Wrapper Scrollable */}
      <div className="w-screen h-[calc(100vh-40px)] overflow-auto bg-gray-100 p-4">
        <div
          className="flex flex-col mx-auto"
          style={{
            width: `${500 * scale}px`,
            gap: `${20 * scale}px`,
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: `${500 * scale}px`,
                height: `${500 * scale}px`,
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                background: "white",
                border: "1px solid #ddd",
              }}
            >
              <Stage
                width={500 * scale}
                height={500 * scale}
                scale={{ x: scale, y: scale }}
              >
                <Layer>
                  {elements.map((el) => (
                    <KonvaElement
                      key={el.id}
                      element={el}
                      onDragMove={(e) =>
                        updateElementPosition(el.id, e.target.x(), e.target.y())
                      }
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KonvaMultiPage;

// 🏗️ Komponen Elemen Konva
const KonvaElement = ({
  element,
  onDragMove,
}: {
  element: KonvaElement;
  onDragMove: (e: { target: { x: () => number; y: () => number } }) => void;
}) => {
  const commonProps = {
    x: element.x,
    y: element.y,
    fill: element.fill,
    draggable: true,
    onDragMove,
  };

  switch (element.type) {
    case "rect":
      return (
        <Rect {...commonProps} width={element.width} height={element.height} />
      );
    case "circle":
      return <Circle {...commonProps} radius={element.radius} />;
    case "text":
      return <Text {...commonProps} text={element.text} fontSize={16} />;
    default:
      return null;
  }
};
