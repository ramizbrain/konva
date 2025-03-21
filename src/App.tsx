import { useEffect, useRef, useState } from "react";
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

function KonvaMultiPage() {
  const [elements, setElements] = useState<KonvaElement[]>([]);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);

  // Handle zoom (pinch dan wheel) di level wrapper
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Menghitung jarak antara dua titik sentuhan
    const getDistance = (touches: TouchList): number => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Variabel untuk melacak apakah sedang dalam mode pinch zoom
    let isPinching = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Hanya cegah default jika memang pinch zoom
        e.preventDefault();
        isPinching = true;
        const distance = getDistance(e.touches);
        initialDistance.current = distance;
        initialScale.current = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        e.touches.length === 2 &&
        initialDistance.current !== null &&
        isPinching
      ) {
        // Cegah scroll saat pinch zoom
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const scaleFactor = currentDistance / initialDistance.current;
        const newScale = Math.max(
          0.1,
          Math.min(3, initialScale.current * scaleFactor)
        );
        setScale(newScale);
      }
    };

    const handleTouchEnd = () => {
      initialDistance.current = null;
      isPinching = false;
    };

    // Tambahkan wheel zoom untuk testing di desktop
    const handleWheel = (e: WheelEvent) => {
      // Gunakan Ctrl+Wheel untuk zoom
      if (e.ctrlKey) {
        e.preventDefault();
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out/in
        const newScale = Math.max(0.1, Math.min(3, scale * scaleFactor));
        setScale(newScale);
      }
    };

    // Pasang event listener pada wrapper
    wrapper.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    wrapper.addEventListener("touchmove", handleTouchMove, { passive: false });
    wrapper.addEventListener("touchend", handleTouchEnd);
    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("touchmove", handleTouchMove);
      wrapper.removeEventListener("touchend", handleTouchEnd);
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

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

      {/* <div className="w-[200px] h-[calc(100vh-40px)] absolute top-[40px] right-0 bg-amber-300">
        <p>properties</p>
      </div> */}

      {/* Wrapper Scrollable */}
      <div
        ref={wrapperRef}
        className="w-screen h-[calc(100vh-40px)] overflow-auto bg-gray-100 p-4 relative touch-none"
      >
        <div
          ref={contentRef}
          className="flex flex-col mx-auto touch-none" /* touch-none mencegah event touch default */
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
}

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
