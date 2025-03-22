import { Layer, Stage } from "react-konva";
import type { Element, Page } from "../types/canvas";
import { KonvaElement } from "./KonvaElement";

interface CanvasProps {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  pages: Page[];
  elements: Element[];
  currentPage: number;
  scale: number;
  onPageSelect: (pageId: number) => void;
  onElementDrag: (id: number, x: number, y: number) => void;
}

export const Canvas = ({
  wrapperRef,
  contentRef,
  pages,
  elements,
  currentPage,
  scale,
  onPageSelect,
  onElementDrag,
}: CanvasProps) => {
  return (
    <div
      ref={wrapperRef}
      className="w-screen h-[calc(100vh-80px)] overflow-auto bg-gray-100 p-4 relative touch-none"
    >
      <div
        ref={contentRef}
        className="flex flex-col mx-auto touch-none" /* touch-none prevents default touch events */
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
            onClick={() => onPageSelect(page.id)}
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
                        onElementDrag(el.id, e.target.x(), e.target.y())
                      }
                    />
                  ))}
              </Layer>
            </Stage>
          </div>
        ))}
      </div>
    </div>
  );
};
