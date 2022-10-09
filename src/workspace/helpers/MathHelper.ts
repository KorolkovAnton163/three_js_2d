export const GRID_SIZE = 20;

export default class {
    public static alignPointToGrid(p: {x: number; y: number}): { x: number; y: number } {
        const startX = Math.ceil(p.x / GRID_SIZE) * GRID_SIZE;
        const startY = Math.ceil(p.y / GRID_SIZE) * GRID_SIZE;
    
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
    
        let closestX = startX;
        let closestY = startY;
    
        for (let i = startX - GRID_SIZE; i < startX + GRID_SIZE; i += GRID_SIZE) {
          const diffX = Math.abs(i - p.x);
    
          if (diffX < minX) {
            minX = diffX;
            closestX = i;
          }
        }
    
        for (let j = startY - GRID_SIZE; j < startY + GRID_SIZE; j += GRID_SIZE) {
          const diffY = Math.abs(j - p.y);
    
          if (diffY < minY) {
            minY = diffY;
            closestY = j;
          }
        }
    
        return {
          x: closestX,
          y: closestY,
        };
      }
}