export interface Position {
  x: number
  y: number
}

export class GameMap {
  readonly gridSize: number
  readonly cellSize: number
  readonly canvasSize: number

  constructor(gridSize: number, cellSize: number) {
    this.gridSize = gridSize
    this.cellSize = cellSize
    this.canvasSize = gridSize * cellSize
  }

  /**
   * 绘制网格
   */
  drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = '#16213e'
    ctx.lineWidth = 0.5

    for (let i = 0; i <= this.gridSize; i++) {
      ctx.beginPath()
      ctx.moveTo(i * this.cellSize, 0)
      ctx.lineTo(i * this.cellSize, this.canvasSize)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * this.cellSize)
      ctx.lineTo(this.canvasSize, i * this.cellSize)
      ctx.stroke()
    }
  }

  /**
   * 清空画布
   */
  clearCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, this.canvasSize, this.canvasSize)
  }

  /**
   * 检查位置是否在地图范围内
   */
  isWithinBounds(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.gridSize &&
      position.y >= 0 &&
      position.y < this.gridSize
    )
  }
}