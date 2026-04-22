export interface Position {
  x: number
  y: number
}

export class Food {
  private _position: Position
  private readonly gridSize: number

  constructor(gridSize: number) {
    this.gridSize = gridSize
    this._position = { x: 0, y: 0 }
  }

  get position(): Position {
    return { ...this._position }
  }

  /**
   * 在网格上随机生成食物，避开蛇身
   */
  generate(snakePositions: Position[]): boolean {
    const maxAttempts = 1000
    const totalCells = this.gridSize * this.gridSize

    // 如果蛇已经占满整个网格，游戏胜利
    if (snakePositions.length >= totalCells) {
      return false
    }

    for (let i = 0; i < maxAttempts; i++) {
      const newPosition: Position = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      }

      const isOnSnake = snakePositions.some(
        segment => segment.x === newPosition.x && segment.y === newPosition.y
      )

      if (!isOnSnake) {
        this._position = newPosition
        return true
      }
    }

    // 降级方案：顺序查找空闲位置
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const isOnSnake = snakePositions.some(
          segment => segment.x === x && segment.y === y
        )
        if (!isOnSnake) {
          this._position = { x, y }
          return true
        }
      }
    }

    return false
  }

  /**
   * 检查给定位置是否与食物位置重合
   */
  isAtPosition(position: Position): boolean {
    return this._position.x === position.x && this._position.y === position.y
  }
}