import * as THREE from 'three';
import {ResizePosition} from "../_shims/element";
import {SVGLoader, SVGResult, SVGResultPaths} from "three/examples/jsm/loaders/SVGLoader";

export class Resize {
    private readonly position: ResizePosition;

    private readonly group: THREE.Group;

    private readonly NAME = 'resize';

    private width = 40;

    private height = 40;

    private size: { w: number; h: number };

    private path = '/assets/icons/resize.svg';

    public get object(): THREE.Group {
        return this.group;
    }

    constructor(position: ResizePosition, size: { w: number; h: number }) {
        this.position = position;
        this.size = size;

        const shape = new THREE.Shape([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, this.width),
            new THREE.Vector2(this.width, this.height),
            new THREE.Vector2(this.width, 0),
        ])
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.0,
        });
        const geometry = new THREE.ShapeBufferGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);

        mesh.name = this.NAME;
        mesh.userData = {
            position: this.position
        };

        this.group = new THREE.Group();
        this.group.add(mesh)

        this.group.visible = false;

        this.setPosition();
    }

    private setPosition(): void {
        switch (this.position) {
            case ResizePosition.topLeft:
                this.group.position.x = -this.size.w / 2 - this.width / 2;
                this.group.position.y = this.size.h / 2 - this.width / 2 ;
                break;
            case ResizePosition.topRight:
                this.group.position.x = this.size.w / 2 - this.width / 2;
                this.group.position.y = this.size.h / 2 - this.height / 2;
                break;
            case ResizePosition.bottomLeft:
                this.group.position.x = -this.size.w / 2 - this.width / 2;
                this.group.position.y = -this.size.h / 2 - this.height / 2;
                break;
            case ResizePosition.bottomRight:
                this.group.position.x = this.size.w / 2 - this.width / 2;
                this.group.position.y = -this.size.h / 2 - this.height / 2;
                break;
            default:
                this.group.position.x = 0;
                this.group.position.y = 0;
        }
    }

    private setSvgRotation(mesh: THREE.Mesh): void {
        switch (this.position) {
            case ResizePosition.topLeft:
                mesh.rotation.z = 90 * Math.PI / 180;
                break;
            case ResizePosition.topRight:
                mesh.rotation.z = 0;
                break;
            case ResizePosition.bottomLeft:
                mesh.rotation.z = 180 * Math.PI / 180;
                break;
            case ResizePosition.bottomRight:
                mesh.rotation.z = -90 * Math.PI / 180;
                break;
            default:
                mesh.rotation.z = 0;
                break;
        }
    }

    public show(): void {
        const loader = new SVGLoader();

        loader.load(this.path, (data: SVGResult) => {
            data.paths.forEach((path: SVGResultPaths) => {
                const shapes = SVGLoader.createShapes(path);

                shapes.forEach((shape: THREE.Shape) => {
                    const geometry = new THREE.ShapeBufferGeometry(shape);
                    const material = new THREE.MeshBasicMaterial({
                        color: 0x979797,
                        side: THREE.DoubleSide,
                        depthWrite: false
                    });
                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.name = this.NAME;
                    mesh.userData = {
                        position: this.position
                    };

                    this.setSvgRotation(mesh);

                    mesh.position.x = this.width / 2;
                    mesh.position.y = this.height / 2;

                    this.group.add(mesh);
                });
            });

            this.group.visible = true;
        });
    }

    public hide(): void {
        this.group.visible = false;
    }

    public dispose(): void {
        // this.geometry.dispose();
        // this.material.dispose();
    }
}