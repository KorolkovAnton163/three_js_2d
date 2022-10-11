import * as THREE from 'three';

export enum ResizePosition {
    topLeft = 'topLeft',
    topRight = 'topRight',
    bottomLeft = 'bottomLeft',
    bottomRight = 'bottomRight',
}

export interface IElement {
    uuid: string;
    x: number;
    y: number;
    w: number;
    h: number;
    object: THREE.Object3D;
    isSelected: boolean;

    select(): void;
    deselect(): void;
    move(x: number, y: number): void;
    resize(w: number, h: number): void;
    over(intersects: THREE.Intersection<THREE.Object3D>[]): void;
}