import * as THREE from 'three';
import { Element } from "../Element";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import NoteElementInterface from "../../_shims/models/note";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";

export class NoteElement extends Element {
    private readonly mesh: CSS2DObject;

    constructor(element: NoteElementInterface, font: Font) {
        super(element, font);

        this.min.w = 240;
        this.min.h = 60;

        const div = document.createElement('div');

        div.style.width = '200px';
        div.style.height = '200px';
        div.innerText = 'Hello World';

        this.mesh = new CSS2DObject(div);

        this.group.add(this.mesh);
    }
}