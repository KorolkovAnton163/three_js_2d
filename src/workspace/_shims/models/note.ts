import ElementInterface from './_element';
import NoteElementData from './data/note';

export enum NoteElementDefault {
  w = 240,
  h = 240,
}

export default interface NoteElementInterface extends ElementInterface {
  data: NoteElementData;
}
