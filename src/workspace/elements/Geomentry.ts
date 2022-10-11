import * as THREE from 'three';

export class Geometry {
    public uuid: string;

    protected geometry: THREE.ShapeBufferGeometry;

    protected material: THREE.MeshBasicMaterial;

    protected mesh: THREE.Mesh;

    protected shape: THREE.Shape;

    protected width: number;

    protected height: number;

    private gx = 1;

    private gy = 1;

    private radius = 5;

    public get object(): THREE.Mesh {
        return this.mesh;
    }

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

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

        this.geometry = new THREE.ShapeBufferGeometry(this.shape);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.setPosition(-this.width / 2, -this.height / 2);

        this.uuid = this.mesh.uuid;
    }

    public select(): void {
        this.material.color.set(0xff0000);
    }

    public deselect(): void {
        this.material.color.set(0xffffff);
    }

    public setPosition(x: number, y: number): void {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
    }

    public resize(w: number, h: number): void {
        this.width = w;
        this.height = h;
    }
}