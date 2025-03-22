import { useState } from "react";
import type { Element, NodeType } from "../types/canvas";

export function useElements() {
  const [elements, setElements] = useState<Element[]>([]);

  // Add a new element
  const addElement = (type: NodeType, pageId: number) => {
    setElements((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type,
        x: Math.random() * 200,
        y: Math.random() * 200,
        fill:
          type === "RECTANGLE" ? "red" : type === "CIRCLE" ? "blue" : "black",
        text: type === "TEXT" ? "New Text" : "",
        radius: type === "CIRCLE" ? 30 : undefined,
        width: type === "RECTANGLE" ? 100 : undefined,
        height: type === "RECTANGLE" ? 100 : undefined,
        pageId,
      },
    ]);
  };

  // Update element position when dragged
  const updateElementPosition = (id: number, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  return {
    elements,
    setElements,
    addElement,
    updateElementPosition,
  };
}
