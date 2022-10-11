import * as THREE from 'three';
import { Core } from "./Core";
import MathHelper from "./helpers/MathHelper";
import MouseHelper from "./helpers/MouseHelper";
import { ResizePosition } from "./_shims/element";

export abstract class Interaction extends Core {
    protected abstract drawGrid(): void;

    protected key: string | null = null;

    protected zoom = 1;

    protected left = 0;

    protected top = 0;

    private moving = false;

    private draggable = false;

    private resizable = false;

    private offset = {
        x: 0,
        y: 0,
    };

    protected bind(): void {
        window.addEventListener('resize', () => {
            this.onResize();
        });

        window.addEventListener('mousedown', (e: MouseEvent) => {
            this.onMouseDown(e);
        });

        window.addEventListener('mousemove', (e: MouseEvent) => {
            this.onMouseMove(e);
        });

        window.addEventListener('mouseup', (e: MouseEvent) => {
            this.onMouseUp(e)
        });

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.onKeyDown(e);
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
           this.onKeyUp(e);
        });

        window.addEventListener('wheel', (e: WheelEvent) => {        
            this.onWheel(e);
        }, { passive: false });
    }

    protected unbind(): void {
        window.removeEventListener('resize', () => {
            this.onResize();
        });

        window.removeEventListener('mousedown', (e: MouseEvent) => {
            this.onMouseDown(e);
        });

        window.removeEventListener('mousemove', (e: MouseEvent) => {
            this.onMouseMove(e);
        });

        window.removeEventListener('mouseup', (e: MouseEvent) => {
            this.onMouseUp(e);
        });

        window.removeEventListener('keydown', (e: KeyboardEvent) => {
            this.onKeyDown(e);
        });

        window.removeEventListener('wheel', (e: WheelEvent) => {        
            this.onWheel(e);
        });
    }

    private onResize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRation(window.devicePixelRatio);
    }

    private onMouseDown(e: MouseEvent): void {
        this.offset.x = e.pageX;
        this.offset.y = e.pageY;

        if (this.onWorkspaceMovingStart()) {
            return;
        }

        const intersects = this.getIntersectObjects({ x: e.clientX, y: e.clientY });
        
        if (this.onCurrentResizeStart(intersects)) {
            return;
        }

        if (this.onCurrentSet(intersects)) {
            return;
        }

        if (this.onCurrentReset(intersects)) {
            return;
        }
    }

    private onMouseMove(e: MouseEvent): void {
        const intersects = this.getIntersectObjects({ x: e.clientX, y: e.clientY });

        if (this.onCurrentOver(intersects, e)) {
            return;
        }

        if (!MouseHelper.isLeftButtonPressed(e)) {
            return;
        }

        if (this.onWorkspaceMovingMove(e)) {
            return;
        }

        if (this.onCurrentResizeMove(e)) {
            return;
        }

        if (this.onCurrentMovingStart()) {
            return;
        }

        if (this.onCurrentMovingMove(e)) {
            return;
        }
    }

    private onMouseUp(e: MouseEvent): void {
        this.offset.x = 0;
        this.offset.y = 0;
        this.container.classList.remove('moving');

        if (this.onWorkspaceMovingEnd()) {
            return;
        }

        if (this.onCurrentResizeEnd()) {
            return;
        }

        if (this.onCurrentMovingEnd()) {
            return;
        }

        if (this.onCurrentSelect()) {
            return;
        }
    }

    private onKeyDown(e: KeyboardEvent): void {
        this.key = e.code;
    }

    private onKeyUp(e: KeyboardEvent): void {
        this.key = null;
    }

    private onWheel(e: WheelEvent): void {
        e.preventDefault();
        e.stopPropagation();

        this.left -= e.deltaX;
        this.top -= e.deltaY;

        this.camera.setPosition(
            this.camera.x + e.deltaX / this.zoom,
            this.camera.y - e.deltaY / this.zoom,
        );

        this.drawGrid();
    }

    private onWorkspaceMovingStart(): boolean {
        if (!this.key || this.key !== 'Space') {
            return false;
        }

        this.moving = true;

        this.container.classList.add('moving');

        return true;
    }

    private onWorkspaceMovingMove(e: MouseEvent): boolean {
        if (!this.moving) {
            return false;
        }

        this.left += e.pageX - this.offset.x;
        this.top += e.pageY - this.offset.y;
        
        this.camera.setPosition(
            this.camera.x - (e.pageX - this.offset.x) / this.zoom, 
            this.camera.y + (e.pageY - this.offset.y) / this.zoom, 
        );

        this.drawGrid();

        this.offset.x = e.pageX;
        this.offset.y = e.pageY;

        return true;
    }

    private onWorkspaceMovingEnd(): boolean {
        if (!this.moving) {
            return false;
        }

        this.moving = false;
        this.offset.x = 0;
        this.offset.y = 0;

        return true;
    }

    private onCurrentSet(intersects: THREE.Intersection<THREE.Object3D>[]): boolean {
        if (intersects.length === 0) {
            return false;
        }

        const object = intersects[intersects.length - 1].object;
        const uuid = object.parent ? object.parent.uuid : object.uuid;

        if (this.current !== null && this.current.uuid !== uuid) {
            this.current.deselect();
        }

        this.current = this.elements[uuid] ?? null;

        return true;
    }

    private onCurrentReset(intersects: THREE.Intersection<THREE.Object3D>[]): boolean {
        if (intersects.length !== 0 || this.current === null) {
            return false;
        }

        this.current.deselect();
        this.current = null;

        return true;
    }

    private onCurrentResizeStart(intersects: THREE.Intersection<THREE.Object3D>[]): boolean {
        if (this.current === null || intersects.length === 0) {
            return false;
        }

        if (!this.current.isSelected) {
            return false;
        }

        const object = intersects[intersects.length - 1].object;

        if (object.name !== 'resize') {
            return false;
        }

        this.resizable = true;

        return true;
    }

    private onCurrentResizeMove(e: MouseEvent): boolean {
        if (this.current === null || !this.resizable) {
            return false;
        }

        this.current.resize(
            this.current.w + (e.pageX - this.offset.x),
            this.current.h + (e.pageY - this.offset.y),
        );

        this.offset.x = e.pageX;
        this.offset.y = e.pageY;

        return true;
    }

    private onCurrentResizeEnd(): boolean {
        if (this.current === null || !this.resizable) {
            return false;
        }

        this.resizable = false;

        return true;
    }

    private onCurrentMovingStart(): boolean {
        if (this.current === null || this.draggable) {
            return false;
        }

        this.draggable = true;

        this.container.classList.add('moving');

        return true;
    }

    private onCurrentMovingMove(e: MouseEvent): boolean {
        if (this.current === null || !this.draggable) {
            return false;
        }

        this.current.move(
            this.current.x + (e.pageX - this.offset.x) / this.zoom,
            this.current.y - (e.pageY - this.offset.y) / this.zoom,
        );

        this.offset.x = e.pageX;
        this.offset.y = e.pageY;

        return true;
    }

    private onCurrentMovingEnd(): boolean {
        if (this.current === null || !this.draggable) {
            return false
        }

        const point = MathHelper.alignPointToGrid({
            x: this.current.x,
            y: this.current.y,
        });

        this.current.move(point.x, point.y);

        this.draggable = false;

        return true;
    }

    private onCurrentSelect(): boolean {
        if (this.current === null) {
            return false;
        }

        this.current.select();

        return true;
    }

    private onCurrentOver(intersects: THREE.Intersection<THREE.Object3D>[], e: MouseEvent): boolean {
        if (this.current === null || !this.current.isSelected || e.buttons !== 0) {
            return false;
        }

        this.current.over(intersects);

        return true;
    }

    protected onZoom(zoom: number): void {
        this.zoom = zoom;
        this.camera.setZoom(this.zoom);
        this.drawGrid();
    }
}