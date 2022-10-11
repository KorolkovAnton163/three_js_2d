import ElementInterface from './_element';
import ToDoElementData from './data/todo';

export enum ToDoElementDefault {
  w = 240,
  h = 60,
}

export default interface ToDoElementInterface extends ElementInterface {
  data: ToDoElementData;
}
