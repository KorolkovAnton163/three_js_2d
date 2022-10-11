import ElementInterface from './_element';
import CommentElementData from './data/comment';

export enum CommentElementDefault {
  w = 32,
  h = 32,
}

export default interface CommentElementInterface extends ElementInterface {
  data: CommentElementData;
}
