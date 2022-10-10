import { GRID_SIZE } from "./helpers/MathHelper";
import { Interaction } from "./Interaction";

export class Workspace extends Interaction {
    private background = '#eeeedd'

    protected drawGrid(): void {
        const canvas = this.renderer.getElement();

        canvas.style.backgroundImage = `linear-gradient(transparent, transparent 2px, ${this.background} 0.5px, ${this.background} ${GRID_SIZE}px),
            linear-gradient(to right, rgba(117, 121, 129, 0.4), rgba(117, 121, 129, 0.4) 2px, ${this.background} 2px, ${this.background} ${GRID_SIZE}px)`;
        canvas.style.backgroundSize = `${GRID_SIZE * this.zoom}px ${GRID_SIZE * this.zoom}px`;
        canvas.style.backgroundPosition = `${this.left}px ${this.top}px`;
    }

    public async run(): Promise<void> {
        await super.run();

        this.onZoom(1);

        this.drawGrid();
        this.bind();
    }
}