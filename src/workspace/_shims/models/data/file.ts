import {Point} from "../../data";
import {ImageSize} from "../file";

export interface ImageFileCropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

export interface ItemPreviewOffsetInterface {
  item: number;
  offset: string;
}

export interface FileElementDraggableData extends FileElementData {
  draggable: Point;
}

export default interface FileElementData {
  path: string;
  file?: number;
  viewer?: {
    id: number;
    type: string;
  };
  tracking?: string;
  percent?: number;
  imageFileCrop?: ImageFileCropData;
  imageSize?: ImageSize;
  previewOffset?: string | ItemPreviewOffsetInterface[];
}
