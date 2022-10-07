import * as THREE from 'three';

export class Scene {
    private readonly scene: THREE.Scene;

    public get children(): THREE.Object3D[] {
        return this.scene.children;
    }

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa8def0);
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public add(object: THREE.Object3D): void {
        this.scene.add(object);
    }
}