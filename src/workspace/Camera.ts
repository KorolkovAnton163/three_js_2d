import * as THREE from 'three';

export class Camera {
    private readonly camera: THREE.OrthographicCamera;

    public get x(): number {
        return this.camera.position.x;
    }

    public get y(): number {
        return this.camera.position.y;
    }

    public get zoom(): number {
        return this.camera.zoom;
    }

    constructor() {
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2, 
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            window.innerHeight / -2,
            400,
            -400
        );

        this.setPosition(window.innerWidth / 2, window.innerHeight / -2);
    }

    public getCamera(): THREE.OrthographicCamera {
        return this.camera;
    }

    public setPosition(x: number, y: number): void {
        this.camera.position.set(x, y, 1);
    }

    public setZoom(zoom: number): void {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
    }
}