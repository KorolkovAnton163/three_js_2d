import ElementInterface, {ElementType} from "../_shims/models/_element";
import {IElement} from "../_shims/element";
import {FileElement} from "../elements/file/FileElement";
import FileElementInterface from "../_shims/models/file";

export default class {
    public static CreateElement(element: ElementInterface): IElement {
        switch (element.component) {
            case ElementType.file:
                return new FileElement(element as FileElementInterface);
        }
    }
}