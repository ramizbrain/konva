import type { NodeType } from "../types/canvas";

interface ToolbarProps {
  onAddElement: (type: NodeType) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onAddPage: () => void;
}

export const Toolbar = ({
  onAddElement,
  onZoomIn,
  onZoomOut,
  onAddPage,
}: ToolbarProps) => {
  return (
    <div className="flex h-[40px] gap-2 bg-amber-900 w-full text-center">
      <button onClick={() => onAddElement("RECTANGLE")}>Add Rect</button>
      <button onClick={() => onAddElement("CIRCLE")}>Add Circle</button>
      <button onClick={() => onAddElement("TEXT")}>Add Text</button>
      <button onClick={onZoomIn}>Zoom In</button>
      <button onClick={onZoomOut}>Zoom Out</button>
      <button onClick={onAddPage}>Add Page</button>
    </div>
  );
};
