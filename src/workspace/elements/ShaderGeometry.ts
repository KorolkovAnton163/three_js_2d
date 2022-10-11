import * as THREE from "three";
import GeometryHelper from "../helpers/GeometryHelper";

export class ShaderGeometry {
    protected geometry: THREE.PlaneGeometry;

    protected material: THREE.ShaderMaterial;

    protected mesh: THREE.Mesh;

    protected width: number;

    protected height: number;

    public get object(): THREE.Mesh {
        return this.mesh;
    }

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

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

    public setTexture(path: string): void {
        const texture = new THREE.TextureLoader().load(path);

        this.material.uniforms.textures = { value: texture };

        this.material.fragmentShader = GeometryHelper.FragmentTextureShader();

        this.material.uniformsNeedUpdate = true;
    }

    public select(): void {
        this.material.uniforms.borderWidth.value = 2;

        this.material.uniformsNeedUpdate = true;
    }

    public deselect(): void {
        this.material.uniforms.borderWidth.value = 0;

        this.material.uniformsNeedUpdate = true;
    }

    //TODO: implement resize logic
    public resize(w: number, h: number): void {
        this.width = w;
        this.height = h;
    }
}