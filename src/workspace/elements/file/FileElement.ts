import { Element } from "../Element";
import FileElementInterface from "../../_shims/models/file";

export class FileElement extends Element {
    constructor(element: FileElementInterface) {
        super(element);

        this.geometry.setTexture(element.data.path);
    }
}