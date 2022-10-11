import { Element } from "../Element";
import FileElementInterface from "../../_shims/models/file";

export class FileElement extends Element {
    constructor(element: FileElementInterface) {
        super(element);

        this.aspectRation = true;

        this.min.w = 240;

        this.geometry.setTexture(element.data.path);
    }
}