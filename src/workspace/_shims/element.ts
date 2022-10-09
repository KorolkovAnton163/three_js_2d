import * as THREE from 'three';

export interface IElement {
    uuid: string;
    x: number;
    y: number;
    w: number;
    h: number;
    object: THREE.Mesh;

    select(): void;
    deselect(): void;
    setPosition(x: number, y: number): void;
}