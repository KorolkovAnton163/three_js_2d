import ElementInterface, {ElementType} from "../_shims/models/_element";
import {IElement} from "../_shims/element";
import {FileElement} from "../elements/file/FileElement";
import FileElementInterface from "../_shims/models/file";
import {NoteElement} from "../elements/note/NoteElement";
import NoteElementInterface from "../_shims/models/note";
import { Font } from "three/examples/jsm/loaders/FontLoader";

export default class {
    public static CreateElement(element: ElementInterface, font: Font): IElement {
        switch (element.component) {
            case ElementType.note:
                return new NoteElement(element as NoteElementInterface, font);
            case ElementType.file:
                return new FileElement(element as FileElementInterface, font);
        }
    }
}