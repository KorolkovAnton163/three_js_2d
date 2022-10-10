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
        
        if (this.current !== null && this.current.isSelected && intersects.length !== 0) {
            const object = intersects[intersects.length - 1].object;

            if (object.name === 'resize') {
                this.resizable = true;

                return;
            }
        }

        if (intersects.length !== 0) {
            const object = intersects[intersects.length - 1].object;
            const uuid = object.parent ? object.parent.uuid : object.uuid;
            

            if (this.current !== null && this.current.uuid !== uuid) {
                this.current.deselect();
            }

            this.current = this.elements[uuid] ?? null;

            return;
        }

        if (intersects.length === 0 && this.current !== null) {
            this.current.deselect();
            this.current = null;

            return;
        }
    }

    private onMouseMove(e: MouseEvent): void {
        const intersects = this.getIntersectObjects({ x: e.clientX, y: e.clientY });

        if (this.current && this.current.isSelected && e.buttons === 0) {
            if (intersects.length !== 0) {
                const object = intersects[intersects.length - 1].object;

                if (object.name === 'resize') {
                    this.current.showResize(object.userData.position as ResizePosition);
                } else {
                    this.current.showResize(ResizePosition.bottomRight);
                }
            } else {
                this.current.showResize(ResizePosition.bottomRight);
            }

            return;
        }

        if (!MouseHelper.isLeftButtonPressed(e)) {
            return;
        }

        if (this.onWorkspaceMovingMove(e)) {
            return;
        }

        if (this.current !== null && this.resizable) {
            this.current.resize(
                this.current.w + (e.pageX - this.offset.x),
                this.current.h + (e.pageY - this.offset.y),
            );

            this.offset.x = e.pageX;
            this.offset.y = e.pageY;

            return;
        }

        if (this.current !== null && !this.draggable) {
            this.draggable = true;

            this.container.classList.add('moving');

            return;
        }

        if (this.current !== null && this.draggable) {
            this.current.setPosition(
                this.current.x + (e.pageX - this.offset.x) / this.zoom, 
                this.current.y - (e.pageY - this.offset.y) / this.zoom, 
            );

            this.offset.x = e.pageX;
            this.offset.y = e.pageY;

            return;
        }
    }

    private onMouseUp(e: MouseEvent): void {
        this.container.classList.remove('moving');

        if (this.onWorkspaceMovingEnd()) {
            return;
        }

        if (this.draggable && this.current !== null) {
            const point = MathHelper.alignPointToGrid({
                x: this.current.x,
                y: this.current.y,
            });

            this.current.setPosition(point.x, point.y);

            this.draggable = false;

            return;
        }

        if (this.current !== null) {
            this.current.select();

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

    protected onZoom(zoom: number): void {
        this.zoom = zoom;
        this.camera.setZoom(this.zoom);
        this.drawGrid();
    }
}