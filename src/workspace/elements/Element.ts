import { Geometry } from './Geomentry';
import { IElement } from "../_shims/element";

export class Element extends Geometry implements IElement {
    public get x(): number {
        return this.mesh.position.x;
    }

    public get y(): number {
        return this.mesh.position.y;
    }

    public get w(): number {
        return this.width;
    }

    public get h(): number {
        return this.height;
    }

    public select(): void {
        super.select();
    }
}