import * as THREE from 'three';
import { IElement } from "../_shims/element";
import { ShaderGeometry } from './ShaderGeometry';

export class Element implements IElement {
    public uuid: string;

    protected group: THREE.Group;

    protected width = 200;

    protected height = 200;

    protected geomenty: ShaderGeometry;

    public get object(): THREE.Object3D {
        return this.group;
    }

    public get x(): number {
        return this.group.position.x;
    }

    public get y(): number {
        return this.group.position.y;
    }

    public get w(): number {
        return this.width;
    }

    public get h(): number {
        return this.height;
    }

    constructor() {
        this.geomenty = new ShaderGeometry();

        this.group = new THREE.Group();

        this.group.add(this.geomenty.object);

        this.uuid = this.group.uuid;
    }

    public select(): void {
        this.geomenty.select();
    }

    public deselect(): void {
        this.geomenty.deselect();
    }

    public setPosition(x: number, y: number): void {
        this.group.position.x = x;
        this.group.position.y = y;
    }
}