import ElementInterface from './_element';
import GoogleDocumentElementData from './data/google';

export enum GoogleDocumentElementDefault {
  w = 240,
  h = 180,
}

export default interface GoogleDocumentElementInterface extends ElementInterface {
  data: GoogleDocumentElementData;
}
