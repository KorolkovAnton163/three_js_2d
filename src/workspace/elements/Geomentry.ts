import * as THREE from 'three';

export class Geometry {
    public uuid: string;

    protected geometry: THREE.ShapeBufferGeometry;

    protected material: THREE.MeshBasicMaterial;

    protected mesh: THREE.Mesh;

    protected shape: THREE.Shape;

    protected width = 200;

    protected height = 200;

    private gx = 1;

    private gy = 1;

    private radius = 5;

    public get object(): THREE.Mesh {
        return this.mesh;
    }

    constructor() {
        this.shape = new THREE.Shape();

        this.shape.moveTo(this.gx, this.gy + this.radius);
        this.shape.lineTo(this.gx, this.gy + this.height - this.radius);
        this.shape.quadraticCurveTo(this.gx, this.gy + this.height, this.gx + this.radius, this.gy + this.height);
        this.shape.lineTo(this.gx + this.width - this.radius, this.gy + this.height);
        this.shape.quadraticCurveTo(this.gx + this.width, this.gy + this.height, this.gx + this.width, this.gy + this.height - this.radius);
        this.shape.lineTo(this.gx + this.width, this.gy + this.radius);
        this.shape.quadraticCurveTo(this.gx + this.width, this.gy, this.gx + this.width - this.radius, this.gy);
        this.shape.lineTo(this.gx + this.radius, this.gy);
        this.shape.quadraticCurveTo(this.gx, this.gy, this.gx, this.gy + this.radius);

        const test = new THREE.Shape([
            new THREE.Vector2(2, 2),
            new THREE.Vector2(2, 4),
            new THREE.Vector2(4, 4),
            new THREE.Vector2(4, 2),
        ]);

        this.geometry = new THREE.ShapeBufferGeometry([this.shape, test]);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.uuid = this.mesh.uuid;
    }

    protected select(): void {
        this.material.color.set(0xff0000);
    }

    protected deselect(): void {
        this.material.color.set(0xffffff);
    }

    public setPosition(x: number, y: number): void {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
    }
}