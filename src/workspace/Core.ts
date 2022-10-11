import * as THREE from 'three';
import { Scene } from './Scene';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { IElement } from "./_shims/element";

export abstract class Core {
    protected container: HTMLElement;

    protected scene: Scene;

    protected camera: Camera;

    protected renderer: Renderer;

    protected elements: Record<string, IElement> = {};

    protected current: IElement | null = null;

    constructor(container: HTMLElement) {
        this.container = container;

        this.scene = new Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
    }

    protected getIntersectObjects(point: { x: number, y: number }): THREE.Intersection<THREE.Object3D>[] {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (point.x/ window.innerWidth) * 2 - 1,
            -(point.y / window.innerHeight) * 2 + 1,
        );

        raycaster.setFromCamera(mouse, this.camera.getCamera());

        return raycaster.intersectObjects(this.scene.children, true);
    } 

    public async run(): Promise<void> {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRation(window.devicePixelRatio);
        this.renderer.enableShadowMap(true);

        this.container.appendChild(this.renderer.getElement());
    }

    public loop(): void {
        this.renderer.render(this.scene, this.camera);

        setTimeout(() => {
            this.loop();
        }, 16);
    }
}