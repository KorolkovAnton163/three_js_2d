import * as THREE from 'three';
import {Element} from "../Element";
import {Texture} from "three";

export class FileElement extends Element {
    private path = 'https://storage.dev.flikto.com:9090/testing/1/2/aee8b4bb-3d1c-416f-ae49-6a8177cf67da.min.jpg';

    protected texture: THREE.Texture;

    protected material: THREE.SpriteMaterial;

    protected sprite: THREE.Sprite;

    constructor(width: number, height: number) {
        super(width, height);

        this.texture = new THREE.TextureLoader().load(this.path);

        this.material = new THREE.SpriteMaterial({ map: this.texture, color: 0xffffff });

        this.sprite = new THREE.Sprite(this.material);

        this.sprite.scale.set(this.width, this.height, 1);

        this.group.add(this.sprite);
    }
}