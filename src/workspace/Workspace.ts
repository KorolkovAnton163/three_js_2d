import * as THREE from 'three';
import { Scene } from './Scene';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { Element } from './elements/Element';
import { IElement } from "./_shims/element";
import { Interaction } from "./Interaction";

export class Workspace extends Interaction {
    private container: HTMLElement;

    public scene: Scene;

    public camera: Camera;

    public renderer: Renderer;

    private elements: Record<string, IElement> = {};

    private current: IElement | null = null;

    private moving = false;

    private offset = {
        x: 0,
        y: 0,
    };

    private zoom = 1;

    protected key: string | null = null;

    constructor() {
        super();

        this.container = document.querySelector('.container');

        this.scene = new Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
    }

    private bind(): void {
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.key = e.code;
        });

        window.addEventListener('keyup', () => {
           this.key = null;
        });

        window.addEventListener('mousedown', (e: MouseEvent) => {
            if (this.key !== null && this.key === 'Space') {
                this.moving = true;
                this.offset.x = e.pageX;
                this.offset.y = e.pageY;

                return;
            }

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1,
            );

            raycaster.setFromCamera(mouse, this.camera.getCamera());

            const intersects = raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length !== 0 && this.current === null) {
                this.current = this.elements[intersects[0].object.uuid] ?? null;

                return;
            }

            if (intersects.length === 0 && this.current !== null) {
                this.current.deselect();
                this.current = null;

                return;
            }
        });

        window.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.moving) {
                return;
            }

            this.camera.setPosition(
                this.camera.x - (e.pageX - this.offset.x), 
                this.camera.y + (e.pageY - this.offset.y), 
            );

            this.offset.x = e.pageX;
            this.offset.y = e.pageY;
        });

        window.addEventListener('mouseup', (e: MouseEvent) => {
            if (this.moving) {
                this.moving = false;
                this.offset.x = 0;
                this.offset.y = 0;

                return;
            }

            if (this.current !== null) {
                this.current.select();
            }
        });

        window.addEventListener('wheel', (e: WheelEvent) => {        
            this.camera.setZoom(this.camera.zoom - e.deltaY / 1000);
        });
    }

    public async run(): Promise<void> {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRation(window.devicePixelRatio);
        this.renderer.enableShadowMap(true);

        this.container.appendChild(this.renderer.getElement());

        for (let i = 0; i < 1; i++) {
            const element = new Element();

            element.setPosition(
                window.innerWidth / 2,
                -window.innerHeight / 2,
            );

            this.elements[element.uuid] = element;

            this.scene.add(element.object);
        }

        this.bind();
    }

    public loop(): void {
        this.renderer.render(this.scene, this.camera);

        setTimeout(() => {
            this.loop();
        }, 16);
    }
}