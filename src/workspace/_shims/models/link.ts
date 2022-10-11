import ElementInterface from './_element';
import LinkElementData from './data/link';

export enum LinkElementDefault {
  w = 240,
  h = 60,
}

export default interface LinkElementInterface extends ElementInterface {
  data: LinkElementData;
}
