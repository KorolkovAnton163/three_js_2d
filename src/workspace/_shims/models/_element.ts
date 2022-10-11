import {ElementData} from "./data/_union";

export enum ElementType {
    arrow = 'arrow',
    comment = 'comment',
    file = 'file',
    google = 'google',
    group = 'group',
    link = 'link',
    note = 'note',
    slideshow = 'slideshow',
    todo = 'todo',
}

export interface ElementPositionInterface {
    x: number;
    y: number;
}

export interface ElementSizeInterface {
    w: number;
    h: number;
}

export interface ElementTagInterface {
    color: string | null;
    text: string | null;
}

export interface ElementDataInterface {
    data: ElementData;
}

export interface ElementDefaultInterface extends ElementDataInterface, ElementSizeInterface, ElementPositionInterface {
    component: ElementType;
    tag: ElementTagInterface;
    index: number;
    group: string | null;
    lock: boolean;
}

export default interface ElementInterface extends ElementDefaultInterface {
    uuid: string;
}