import * as THREE from 'three';
import {Core} from "./Core";
import MathHelper from "./helpers/MathHelper";
import MouseHelper from "./helpers/MouseHelper";
import {IElement, ResizePosition} from "./_shims/element";

export abstract class Interaction extends Core {
    protected abstract drawGrid(): void;

    protected key: string | null = null;

    protected zoom = 1;

    protected left = 0;

    protected top = 0;

    private moving = false;

    private draggable = false;

    private resizable = false;

    private resizablePosition: ResizePosition = ResizePosition.bottomRight;

    protected current: IElement | null = null;

    protected selection: IElement[] = [];

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

        if (this.onCurrentSet(intersects, e)) {
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

        if (this.onCurrentSelect(e)) {
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

    private onCurrentSet(intersects: THREE.Intersection<THREE.Object3D>[], e: MouseEvent): boolean {
        if (intersects.length === 0) {
            return false;
        }

        const object = intersects[intersects.length - 1].object;
        const uuid = object.parent ? object.parent.uuid : object.uuid;

        if (this.current !== null && this.current.uuid !== uuid) {
            if (MouseHelper.isSelectionInteract(e)) {
                this.pushSelection(this.current);
            } else if (this.selection.length === 0) {
                this.current.deselect();
            }
        }

        this.current = this.elements[uuid] ?? null;

        return true;
    }

    private onCurrentReset(intersects: THREE.Intersection<THREE.Object3D>[]): boolean {
        if (intersects.length !== 0 || this.current === null) {
            return false;
        }

        this.selection.forEach((e: IElement) => {
           e.deselect();
        });
        this.selection = [];

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

        this.resizablePosition = object.userData.position as ResizePosition;
        this.resizable = true;

        this.container.classList.add(this.resizablePosition);

        return true;
    }

    private onCurrentResizeMove(e: MouseEvent): boolean {
        if (this.current === null || !this.resizable) {
            return false;
        }

        this.current.resize(
            e.pageX - this.offset.x,
            e.pageY - this.offset.y,
            this.resizablePosition
        );

        this.offset.x = e.pageX;
        this.offset.y = e.pageY;

        return true;
    }

    private onCurrentResizeEnd(): boolean {
        if (this.current === null || !this.resizable) {
            return false;
        }

        this.container.classList.remove(this.resizablePosition);
        this.resizable = false;
        this.resizablePosition = ResizePosition.bottomRight;

        return true;
    }

    private onCurrentMovingStart(): boolean {
        if (this.current === null || this.draggable) {
            return false;
        }

        this.draggable = true;

        this.container.classList.add('moving');

        if (!this.inSelection(this.current)) {
            this.selection.forEach((e: IElement) => {
                e.deselect();
            });
            this.selection = [];
        }

        return true;
    }

    private onCurrentMovingMove(e: MouseEvent): boolean {
        if (this.current === null || !this.draggable) {
            return false;
        }

        if (this.selection.length === 0) {
            this.current.move(
                this.current.x + (e.pageX - this.offset.x) / this.zoom,
                this.current.y - (e.pageY - this.offset.y) / this.zoom,
            );
        } else {
            this.selection.forEach((elem: IElement) => {
                elem.move(
                    elem.x + (e.pageX - this.offset.x) / this.zoom,
                    elem.y - (e.pageY - this.offset.y) / this.zoom,
                );
            });
        }

        this.offset.x = e.pageX;
        this.offset.y = e.pageY;

        return true;
    }

    private onCurrentMovingEnd(): boolean {
        if (this.current === null || !this.draggable) {
            return false
        }

        if (this.selection.length === 0) {
            const point = MathHelper.alignPointToGrid({
                x: this.current.x,
                y: this.current.y,
            });

            this.current.move(point.x, point.y);
        } else {
            this.selection.forEach((elem: IElement) => {
                const point = MathHelper.alignPointToGrid({
                    x: elem.x,
                    y: elem.y,
                });

                elem.move(point.x, point.y);
            });
        }

        this.draggable = false;

        return true;
    }

    private onCurrentSelect(e: MouseEvent): boolean {
        if (this.current === null) {
            return false;
        }

        if (MouseHelper.isSelectionInteract(e) && this.inSelection(this.current)) {
            this.current.deselect();
            this.detachSelection(this.current);

            return true;
        }

        if (MouseHelper.isSelectionInteract(e)) {
            this.pushSelection(this.current);
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

    private inSelection(element: IElement): boolean {
        if (this.selection.length === 0) {
            return false;
        }

        return this.selection.some((e: IElement) => { return e.uuid === element.uuid });
    }


    private pushSelection(element: IElement): void {
        if (this.inSelection(element)) {
            return;
        }

        this.selection.push(element);
    }

    private detachSelection(element: IElement): void {
        this.selection = this.selection.filter((e: IElement) => {
            return e.uuid !== element.uuid;
        });
    }

    protected onZoom(zoom: number): void {
        this.zoom = zoom;
        this.camera.setZoom(this.zoom);
        this.drawGrid();
    }
}