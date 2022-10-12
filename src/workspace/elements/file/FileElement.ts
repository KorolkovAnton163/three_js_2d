import { Element } from "../Element";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import FileElementInterface from "../../_shims/models/file";

export class FileElement extends Element {
    constructor(element: FileElementInterface, font: Font) {
        super(element, font);

        this.aspectRation = true;

        this.min.w = 240;

        this.geometry.setTexture(element.data.path);
    }
}