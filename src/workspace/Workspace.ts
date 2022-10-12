import {GRID_SIZE} from "./helpers/MathHelper";
import {Interaction} from "./Interaction";
import ElementInterface, {ElementType} from "./_shims/models/_element";
import FileElementInterface from "./_shims/models/file";
import FileElementData from "./_shims/models/data/file";
import ElementHelper from "./helpers/ElementHelper";
import NoteElementInterface from "./_shims/models/note";
import NoteElementData from "./_shims/models/data/note";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

export class Workspace extends Interaction {
    private background = '#eeeedd'

    private interfaces: ElementInterface[] = [
        {
            uuid: '',
            component: ElementType.note,
            w: 240,
            h: 240,
            x: 160,
            y: -280,
            index: 0,
            group: null,
            tag: {
                color: null,
                text: null,
            },
            data: {
                delta: {},
            } as NoteElementData,
        } as NoteElementInterface,
        {
        uuid: '',
        component: ElementType.file,
        w: 240,
        h: 360,
        x: 420,
        y: -380,
        index: 0,
        group: null,
        tag: {
            color: null,
            text: null,
        },
        data: {
            path: 'https://storage.dev.flikto.com:9090/testing/1/2/12569c39-2ca9-4723-8c07-bf0e658f19ad.min.jpg',
        } as FileElementData,
    } as FileElementInterface,
    {
        uuid: '',
        component: ElementType.file,
        w: 240,
        h: 360,
        x: 680,
        y: -380,
        index: 0,
        group: null,
        tag: {
            color: null,
            text: null,
        },
        data: {
            path: 'https://storage.dev.flikto.com:9090/testing/1/2/246f5ad6-19f1-43bb-a2f3-7381a168fbb9.min.jpg',
        } as FileElementData,
    } as FileElementInterface,];

    protected drawGrid(): void {
        const canvas = this.renderer.getElement();

        canvas.style.backgroundImage = `linear-gradient(transparent, transparent 2px, ${this.background} 0.5px, ${this.background} ${GRID_SIZE}px),
            linear-gradient(to right, rgba(117, 121, 129, 0.4), rgba(117, 121, 129, 0.4) 2px, ${this.background} 2px, ${this.background} ${GRID_SIZE}px)`;
        canvas.style.backgroundSize = `${GRID_SIZE * this.zoom}px ${GRID_SIZE * this.zoom}px`;
        canvas.style.backgroundPosition = `${this.left}px ${this.top}px`;
    }

    public async run(): Promise<void> {
        await super.run();

        const loader = new FontLoader();

        const font = await loader.loadAsync('/assets/fonts/helvetiker_regular.typeface.json');

        this.interfaces.forEach((element: ElementInterface) => {
            const elem = ElementHelper.CreateElement(element, font);

            this.elements[elem.uuid] = elem;

            this.scene.add(elem.object);
        });

        this.onZoom(1);

        this.drawGrid();
        this.bind();
    }
}