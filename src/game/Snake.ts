export interface Position {
  x: number
  y: number
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export const directionMap: Record<Direction, Position> = {
  'UP': { x: 0, y: -1 },
  'DOWN': { x: 0, y: 1 },
  'LEFT': { x: -1, y: 0 },
  'RIGHT': { x: 1, y: 0 }
}

export const oppositeDirection: Record<Direction, Direction> = {
  'UP': 'DOWN',
  'DOWN': 'UP',
  'LEFT': 'RIGHT',
  'RIGHT': 'LEFT'
}

export class Snake {
  private _body: Position[]
  private _direction: Direction
  private _nextDirection: Direction
  private readonly gridSize: number
  private _isGrowing: boolean

  constructor(gridSize: number, initialBody?: Position[]) {
    this.gridSize = gridSize
    this._direction = 'RIGHT'
    this._nextDirection = 'RIGHT'
    this._isGrowing = false

    // 初始化蛇身（默认从中间开始，长度为4）
    if (initialBody) {
      this._body = [...initialBody]
    } else {
      const center = Math.floor(gridSize / 2)
      this._body = [
        { x: center, y: center },
        { x: center - 1, y: center },
        { x: center - 2, y: center },
        { x: center - 3, y: center }
      ]
    }
  }

  get body(): Position[] {
    return [...this._body]
  }

  get head(): Position {
    return { ...this._body[0] }
  }

  get direction(): Direction {
    return this._direction
  }

  get length(): number {
    return this._body.length
  }

  /**
   * 设置下一步移动方向
   */
  setDirection(newDirection: Direction): void {
    if (oppositeDirection[newDirection] !== this._direction) {
      this._nextDirection = newDirection
    }
  }

  /**
   * 移动蛇
   * @returns 是否吃到食物（需要在外部处理分数和食物生成）
   */
  move(): Position {
    // 更新当前方向
    this._direction = this._nextDirection

    // 计算新头部位置
    const move = directionMap[this._direction]
    const newHead: Position = {
      x: this._body[0].x + move.x,
      y: this._body[0].y + move.y
    }

    // 插入新头部
    this._body.unshift(newHead)

    // 如果没有标记为生长，移除尾部
    if (!this._isGrowing) {
      this._body.pop()
    } else {
      this._isGrowing = false
    }

    return newHead
  }

  /**
   * 标记蛇需要增长（吃到食物后调用）
   */
  grow(): void {
    this._isGrowing = true
  }

  /**
   * 检查是否与自身碰撞
   */
  checkSelfCollision(): boolean {
    const head = this._body[0]
    for (let i = 1; i < this._body.length; i++) {
      if (this._body[i].x === head.x && this._body[i].y === head.y) {
        return true
      }
    }
    return false
  }

  /**
   * 检查是否与墙壁碰撞
   */
  checkWallCollision(): boolean {
    const head = this._body[0]
    return (
      head.x < 0 ||
      head.x >= this.gridSize ||
      head.y < 0 ||
      head.y >= this.gridSize
    )
  }

  /**
   * 检查是否与给定位置碰撞
   */
  checkCollisionWith(position: Position): boolean {
    return this._body.some(segment => segment.x === position.x && segment.y === position.y)
  }

  /**
   * 重置蛇
   */
  reset(): void {
    const center = Math.floor(this.gridSize / 2)
    this._body = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
      { x: center - 3, y: center }
    ]
    this._direction = 'RIGHT'
    this._nextDirection = 'RIGHT'
    this._isGrowing = false
  }
}