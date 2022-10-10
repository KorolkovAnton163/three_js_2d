import * as THREE from 'three';
import { Scene } from './Scene';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { Element } from './elements/Element';
import { FileElement } from "./elements/file/FileElement";
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

        for (let i = 0; i < 1; i++) {
            const element = new Element(240, 240);

            element.setPosition(300, -320);

            this.elements[element.uuid] = element;

            this.scene.add(element.object);
        }

        for (let i = 0; i < 1; i++) {
            const file = new FileElement(240, 360);

            file.setPosition(680, -400);

            this.elements[file.uuid] = file;

            this.scene.add(file.object);
        }
    }

    public loop(): void {
        this.renderer.render(this.scene, this.camera);

        setTimeout(() => {
            this.loop();
        }, 16);
    }
}