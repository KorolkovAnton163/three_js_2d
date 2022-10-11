import ElementInterface from './_element';
import DraggableElementData from "./data/draggable";

export default interface DraggableElementInterface extends ElementInterface {
  data: DraggableElementData;
}
