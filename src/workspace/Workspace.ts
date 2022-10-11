import {GRID_SIZE} from "./helpers/MathHelper";
import {Interaction} from "./Interaction";
import ElementInterface, {ElementType} from "./_shims/models/_element";
import FileElementInterface from "./_shims/models/file";
import FileElementData from "./_shims/models/data/file";
import ElementHelper from "./helpers/ElementHelper";

export class Workspace extends Interaction {
    private background = '#eeeedd'

    private interfaces: ElementInterface[] = [{
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
            path: 'https://storage.dev.flikto.com:9090/testing/1/2/aee8b4bb-3d1c-416f-ae49-6a8177cf67da.min.jpg',
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
            path: 'https://storage.dev.flikto.com:9090/testing/1/2/d74b7992-345e-4f55-a25e-b2f93ca4eec7.min.jpg',
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

        this.interfaces.forEach((element: ElementInterface) => {
            const elem = ElementHelper.CreateElement(element);

            this.elements[elem.uuid] = elem;

            this.scene.add(elem.object);
        });

        this.onZoom(1);

        this.drawGrid();
        this.bind();
    }
}