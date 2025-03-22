import { Circle, Rect, Text } from "react-konva";
import type { Element } from "../types/canvas";

interface KonvaElementProps {
  element: Element;
  onDragMove: (e: { target: { x: () => number; y: () => number } }) => void;
}

export const KonvaElement = ({ element, onDragMove }: KonvaElementProps) => {
  const commonProps = {
    x: element.x,
    y: element.y,
    fill: element.fill,
    draggable: true,
    onDragMove,
  };

  switch (element.type) {
    case "RECTANGLE":
      return (
        <Rect {...commonProps} width={element.width} height={element.height} />
      );
    case "CIRCLE":
      return <Circle {...commonProps} radius={element.radius} />;
    case "TEXT":
      return <Text {...commonProps} text={element.text} fontSize={16} />;
    default:
      return null;
  }
};
