import ElementInterface from './_element';
import ArrowElementData from './data/arrow';

export enum ArrowElementDefault {
  w = 150,
  h = 150,
}

export default interface ArrowElementInterface extends ElementInterface {
  data: ArrowElementData;
}
