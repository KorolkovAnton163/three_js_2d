import ElementInterface from './_element';
import FileElementData from './data/file';

export const FILE_WITHOUT_PREVIEW_HEIGHT = 80;

export enum FileElementDefault {
  w = 240,
  h = 180,
}

export interface ImageSize {
  width: number;
  height: number;
}

export default interface FileElementInterface extends ElementInterface {
  data: FileElementData;
}
