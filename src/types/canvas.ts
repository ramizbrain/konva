export type NodeType = "TEXT" | "RECTANGLE" | "CIRCLE" | "IMAGE" | "SVG";

export interface BaseElement {
  id: number;
  type: NodeType;
  x: number;
  y: number;
  fill: string;
  visible?: boolean;
  locked?: boolean;
}

export interface Element extends BaseElement {
  text: string;
  radius?: number;
  width?: number;
  height?: number;
  pageId: number;
}

export interface Page {
  id: number;
  name: string;
  color?: string;
}
