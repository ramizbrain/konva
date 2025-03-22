import { useRef } from "react";
import type { NodeType } from "./types/canvas";
import { useZoom } from "./hooks/useZoom";
import { useElements } from "./hooks/useElements";
import { usePages } from "./hooks/usePages";
import { Toolbar } from "./components/Toolbar";
import { Canvas } from "./components/Canvas";

function KonvaMultiPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize custom hooks
  const { elements, setElements, addElement, updateElementPosition } =
    useElements();
  const { scale, zoomIn, zoomOut } = useZoom(wrapperRef);
  const { pages, currentPage, setCurrentPage, addPage } = usePages(setElements);

  // Handler for adding elements
  const handleAddElement = (type: NodeType) => {
    addElement(type, currentPage);
  };

  return (
    <div className="flex flex-col items-center gap-0 overflow-clip">
      {/* Toolbar */}
      <Toolbar
        onAddElement={handleAddElement}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onAddPage={addPage}
      />

      {/* Canvas */}
      <Canvas
        wrapperRef={wrapperRef}
        contentRef={contentRef}
        pages={pages}
        elements={elements}
        currentPage={currentPage}
        scale={scale}
        onPageSelect={setCurrentPage}
        onElementDrag={updateElementPosition}
      />
    </div>
  );
}

export default KonvaMultiPage;
