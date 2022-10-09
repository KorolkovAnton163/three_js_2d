import * as THREE from "three";
import GeometryHelper from "../helpers/GeometryHelper";

export class ShaderGeometry {
    protected geometry: THREE.PlaneGeometry;

    protected material: THREE.ShaderMaterial;

    protected mesh: THREE.Mesh;

    protected shape: THREE.Shape;

    protected width = 200;

    protected height = 200;

    public get object(): THREE.Mesh {
        return this.mesh;
    }

    constructor() {
        const size = new THREE.Vector2(this.width, this.height);

        const uniforms = {
            borderRadius: { value: 5 },
            borderWidth: { value: 0 },
            size: { value: size },
            color: { value: new THREE.Color(0xffffff) },
            borderColor: { value: new THREE.Color(0x000000) }
        }

        this.geometry = new THREE.PlaneGeometry(this.width, this.height);

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: GeometryHelper.VertexShader(),
            fragmentShader: GeometryHelper.FragmentShader(),
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public select(): void {
        this.material.uniforms.borderWidth.value = 2;

        this.material.uniformsNeedUpdate = true;
    }

    public deselect(): void {
        this.material.uniforms.borderWidth.value = 0;

        this.material.uniformsNeedUpdate = true;
    }

    public setPosition(x: number, y: number): void {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
    }
}