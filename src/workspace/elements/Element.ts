import * as THREE from 'three';
import { IElement, ResizePosition } from "../_shims/element";
import { ShaderGeometry } from './ShaderGeometry';
import { Resize } from "./Resize";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import ElementInterface from "../_shims/models/_element";

export class Element implements IElement {
    public uuid: string;

    protected element: ElementInterface;

    protected font: Font;

    protected selected = false;

    protected group: THREE.Group;

    protected geometry: ShaderGeometry;

    protected resizes: Record<ResizePosition, Resize> | null = null;

    protected aspectRation = false;

    protected currentResizePosition = ResizePosition.bottomRight;

    protected min = {
        w: 0,
        h: 0,
    }

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
        return this.element.w;
    }

    public get h(): number {
        return this.element.h;
    }

    constructor(element: ElementInterface, font: Font) {
        this.element = element;
        this.font = font;

        this.geometry = new ShaderGeometry(this.element.w, this.element.h);

        this.group = new THREE.Group();

        this.group.name = 'element';
        this.group.position.x = element.x;
        this.group.position.y = element.y;

        this.group.add(this.geometry.object);

        this.uuid = this.group.uuid;
    }

    public select(): void {
        this.selected = true;
        this.geometry.select();

        if (this.resizes === null) {
            this.resizes = {
                [ResizePosition.topLeft]: new Resize(ResizePosition.topLeft, { w: this.w, h: this.h }, this.uuid),
                [ResizePosition.topRight]: new Resize(ResizePosition.topRight, { w: this.w, h: this.h }, this.uuid),
                [ResizePosition.bottomLeft]: new Resize(ResizePosition.bottomLeft, { w: this.w, h: this.h }, this.uuid),
                [ResizePosition.bottomRight]: new Resize(ResizePosition.bottomRight, { w: this.w, h: this.h }, this.uuid),
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

    public resize(x: number, y: number, position: ResizePosition): void {
        const rect = this.aspectRation
            ? this.resizeAspectRationLocked(x, y, position)
            : this.resizeAspectRationFree(x, y, position);

        this.group.position.x = rect.x;
        this.group.position.y = rect.y;
        this.geometry.resize(rect.w, rect.h);

        if (this.resizes !== null) {
            Object.values(this.resizes).forEach((r: Resize) => {
                r.move(rect.w, rect.h);
            });
        }

        this.element.w = rect.w;
        this.element.h = rect.h;
    }

    public move(x: number, y: number): void {
        this.group.position.x = x;
        this.group.position.y = y;
    }

    public over(intersects: THREE.Intersection<THREE.Object3D>[]): void {
        if (intersects.length !== 0) {
            const object = intersects[intersects.length - 1].object;

            if (object.name === 'resize') {
                this.showResize(object.userData.position as ResizePosition);
            } else {
                this.showResize(ResizePosition.bottomRight);
            }
        } else {
            this.showResize(ResizePosition.bottomRight);
        }
    }

    private showResize(position: ResizePosition): void {
        if (this.resizes === null || this.currentResizePosition === position) {
            return;
        }

        this.currentResizePosition = position;

        Object.values(this.resizes).forEach((r: Resize) => {
            r.hide();
        });

        this.resizes[position].show();
    }

    private resizeAspectRationLocked(x: number, y: number, position: ResizePosition): { w: number, h: number, x: number; y: number } {
        const ratio = this.w / this.h;
        const width = this.w + x > this.min.w ? this.w + x : this.min.w;

        switch (position) {
            case ResizePosition.topLeft:
                return {
                    w: this.w,
                    h: this.h,
                    x: this.x,
                    y: this.y,
                };
            case ResizePosition.topRight:
                return {
                    w: this.w,
                    h: this.h,
                    x: this.x,
                    y: this.y,
                };
            case ResizePosition.bottomLeft:
                return {
                    w: this.w,
                    h: this.h,
                    x: this.x,
                    y: this.y,
                };
            case ResizePosition.bottomRight:
                return {
                    w: width,
                    h: width / ratio,
                    x: this.x,
                    y: this.y,
                }
            default:
                throw new Error('Unexpected resize position');
        }
    }

    private resizeAspectRationFree(x: number, y: number, position: ResizePosition): { w: number, h: number, x: number; y: number } {
        const width = this.w + x > this.min.w ? this.w + x : this.min.w;
        const height = this.h + y > this.min.h ? this.h + y : this.min.h;

        return {
            w: width,
            h: height,
            x: this.x,
            y: this.y,
        }
    }
}