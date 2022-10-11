import ElementInterface from "./_element";
import SlideshowElementData from "./data/slideshow";

export enum SlideshowElementDefault {
  w = 280,
  h = 200,
  title = 'New slideshow',
}

export default interface SlideshowElementInterface extends ElementInterface {
  data: SlideshowElementData;
}
