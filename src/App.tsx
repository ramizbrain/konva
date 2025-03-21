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
  pageId: number;
}

interface Page {
  id: number;
  name: string;
}

function KonvaMultiPage() {
  const [elements, setElements] = useState<KonvaElement[]>([]);
  const [pages, setPages] = useState<Page[]>([{ id: 1, name: "Page 1" }]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [pageNameInput, setPageNameInput] = useState<string>("");
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
        pageId: currentPage,
      },
    ]);
  };

  // Tambah halaman baru
  const addPage = () => {
    const newId = pages.length + 1;
    setPages((prev) => [...prev, { id: newId, name: `Page ${newId}` }]);
  };

  // Update page name
  const updatePageName = () => {
    if (selectedPage && pageNameInput.trim()) {
      setPages((prev) =>
        prev.map((page) =>
          page.id === selectedPage ? { ...page, name: pageNameInput } : page
        )
      );
      setSelectedPage(null);
    }
  };

  // Delete page
  const deletePage = (pageId: number) => {
    if (pages.length > 1) {
      setPages((prev) => prev.filter((page) => page.id !== pageId));
      setElements((prev) => prev.filter((el) => el.pageId !== pageId));

      // If current page is deleted, select the first available page
      if (currentPage === pageId) {
        const firstAvailablePage = pages.find((page) => page.id !== pageId);
        if (firstAvailablePage) {
          setCurrentPage(firstAvailablePage.id);
        }
      }
    }
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
        <button onClick={addPage}>Add Page</button>
      </div>

      {/* Page Edit Dialog */}
      {selectedPage !== null && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="mb-2">Edit Page Name</h3>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={pageNameInput}
              onChange={(e) => setPageNameInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300"
                onClick={() => setSelectedPage(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white"
                onClick={updatePageName}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
          {pages.map((page) => (
            <div
              key={page.id}
              style={{
                width: `${500 * scale}px`,
                height: `${500 * scale}px`,
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                background: "white",
                border: `${
                  page.id === currentPage
                    ? "0.5px solid #0000ff"
                    : "1px solid #ddd"
                }`,
              }}
              onClick={() => setCurrentPage(page.id)}
            >
              <Stage
                width={500 * scale}
                height={500 * scale}
                scale={{ x: scale, y: scale }}
              >
                <Layer>
                  {elements
                    .filter((el) => el.pageId === page.id)
                    .map((el) => (
                      <KonvaElement
                        key={el.id}
                        element={el}
                        onDragMove={(e) =>
                          updateElementPosition(
                            el.id,
                            e.target.x(),
                            e.target.y()
                          )
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
