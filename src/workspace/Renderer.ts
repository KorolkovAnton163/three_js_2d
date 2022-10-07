import * as THREE from 'three';
import { Camera } from './Camera';
import { Scene } from './Scene';

export class Renderer {
    private readonly renderer: THREE.WebGLRenderer;

    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    public setSize(width: number, height: number): void {
        this.renderer.setSize(width, height);
    }

    public setPixelRation(ration: number): void {
        this.renderer.setPixelRatio(ration);
    }

    public enableShadowMap(enable: boolean): void {
        this.renderer.shadowMap.enabled = enable;
    }

    public getElement(): HTMLCanvasElement {
        return this.renderer.domElement;
    }

    public render(scene: Scene, camera: Camera): void {
        this.renderer.render(scene.getScene(), camera.getCamera());
    }

}