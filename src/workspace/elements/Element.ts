import * as THREE from 'three';
import { IElement, ResizePosition } from "../_shims/element";
import { ShaderGeometry } from './ShaderGeometry';
import { Resize } from "./Resize";

export class Element implements IElement {
    public uuid: string;

    protected selected = false;

    protected group: THREE.Group;

    protected width: number;

    protected height: number;

    protected geometry: ShaderGeometry;

    protected resizes: Record<ResizePosition, Resize> | null = null;

    protected currentResizePosition = ResizePosition.bottomRight;

    public get object(): THREE.Object3D {
        return this.group;
    }

    public get isSelected(): boolean {
        return this.selected;
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

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.geometry = new ShaderGeometry(this.width, this.height);

        this.group = new THREE.Group();

        this.group.name = 'element';

        this.group.add(this.geometry.object);

        this.uuid = this.group.uuid;
    }

    public select(): void {
        this.selected = true;
        this.geometry.select();

        if (this.resizes === null) {
            this.resizes = {
                [ResizePosition.topLeft]: new Resize(ResizePosition.topLeft, { w: this.w, h: this.h }),
                [ResizePosition.topRight]: new Resize(ResizePosition.topRight, { w: this.w, h: this.h }),
                [ResizePosition.bottomLeft]: new Resize(ResizePosition.bottomLeft, { w: this.w, h: this.h }),
                [ResizePosition.bottomRight]: new Resize(ResizePosition.bottomRight, { w: this.w, h: this.h }),
            };

            Object.values(this.resizes).forEach((r: Resize) => {
                this.group.add(r.object);
            });

            this.resizes[this.currentResizePosition].show();
        }
    }

    public deselect(): void {
        this.selected = false;
        this.geometry.deselect();

        if (this.resizes) {
            this.currentResizePosition = ResizePosition.bottomRight;

            Object.values(this.resizes).forEach((r: Resize) => {
                r.dispose();

                this.group.remove(r.object);
            });

            this.resizes = null;
        }
    }

    public showResize(position: ResizePosition): void {
        if (this.resizes === null || this.currentResizePosition === position) {
            return;
        }

        this.currentResizePosition = position;

        Object.values(this.resizes).forEach((r: Resize) => {
            r.hide();
        });

        this.resizes[position].show();
    }

    public resize(w: number, h: number): void {
        this.geometry.resize(w, h);

        this.width = w;
        this.height = h;
    }

    public setPosition(x: number, y: number): void {
        this.group.position.x = x;
        this.group.position.y = y;
    }
}