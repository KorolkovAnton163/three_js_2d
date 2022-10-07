import * as THREE from 'three';
import { Scene } from './Scene';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { Element } from './elements/Element';
import {IElement} from "./_shims/element";

export class Workspace {
    private container: HTMLElement;

    public scene: Scene;

    public camera: Camera;

    public renderer: Renderer;

    private elements: IElement[] = [];

    private moving = false;

    private offset = {
        x: 0,
        y: 0,
    };

    private zoom = 1;

    constructor() {
        this.container = document.querySelector('.container');

        this.scene = new Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
    }

    private bind(): void {
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousedown', (e: MouseEvent) => {
            this.moving = true;
            this.offset.x = e.pageX;
            this.offset.y = e.pageY;
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
            // const current = this.elements.filter((element: IElement) => {
            //     return e.pageX > element.x && e.pageX < element.x + element.w
            //         && e.pageY > element.y && e.pageY < element.y + element.h;
            // });

            const current = this.elements[0];

            current.select();

            if (!this.moving) {
                return;
            }

            this.moving = false;
            this.offset.x = 0;
            this.offset.y = 0;
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

            // element.setPosition(
            //     Math.floor(Math.random() * 5000),
            //     -Math.floor(Math.random() * 5000),
            // );

            element.setPosition(
                window.innerWidth / 2,
                -window.innerHeight / 2,
            );

            this.elements.push(element);

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