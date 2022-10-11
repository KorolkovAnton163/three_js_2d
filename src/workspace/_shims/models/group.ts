import ElementInterface from './_element';
import GroupElementData from './data/group';

export enum GroupElementDefault {
  w = 280,
  h = 60,
}

export default interface GroupElementInterface extends ElementInterface {
  data: GroupElementData;
}
