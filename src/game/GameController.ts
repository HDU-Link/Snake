import { Snake, Direction } from './Snake'
import { Food, Position } from './Food'
import { GameMap } from './GameMap'

export interface GameConfig {
  gridSize: number
  cellSize: number
  initialSpeed: number
}

export class GameController {
  private snake: Snake
  private food: Food
  private map: GameMap
  private config: GameConfig
  
  private _score: number
  private _gameRunning: boolean
  private _gamePaused: boolean
  private _gameOver: boolean
  private _currentSpeed: number

  constructor(config: GameConfig) {
    this.config = config
    this.map = new GameMap(config.gridSize, config.cellSize)
    this.snake = new Snake(config.gridSize)
    this.food = new Food(config.gridSize)
    
    this._score = 0
    this._gameRunning = false
    this._gamePaused = false
    this._gameOver = false
    this._currentSpeed = config.initialSpeed
    
    // 生成初始食物
    this.food.generate(this.snake.body)
  }

  get score(): number {
    return this._score
  }

  get gameRunning(): boolean {
    return this._gameRunning
  }

  get gamePaused(): boolean {
    return this._gamePaused
  }

  get gameOver(): boolean {
    return this._gameOver
  }

  get currentSpeed(): number {
    return this._currentSpeed
  }

  get snakeBody(): Position[] {
    return this.snake.body
  }

  get snakeDirection(): Direction {
    return this.snake.direction
  }

  get foodPosition(): Position {
    return this.food.position
  }

  get mapInfo(): GameMap {
    return this.map
  }

  /**
   * 设置蛇的方向
   */
  setDirection(direction: Direction): void {
    if (this._gameRunning && !this._gamePaused && !this._gameOver) {
      this.snake.setDirection(direction)
    }
  }

  /**
   * 更新游戏状态（移动一步）
   * @returns 游戏是否继续进行
   */
  update(): boolean {
    if (!this._gameRunning || this._gamePaused || this._gameOver) {
      return false
    }

    const newHead = this.snake.move()
    const willEat = this.food.isAtPosition(newHead)

    if (willEat) {
      // 吃到食物
      this.snake.grow()
      this._score++
      this.updateSpeed()
      
      // 生成新食物
      const foodGenerated = this.food.generate(this.snake.body)
      if (!foodGenerated) {
        // 胜利！
        this._gameOver = true
        this._gameRunning = false
        return false
      }
    }

    // 检查碰撞
    if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
      this._gameOver = true
      this._gameRunning = false
      return false
    }

    return true
  }

  /**
   * 根据分数更新游戏速度
   */
  private updateSpeed(): void {
    if (this._currentSpeed > 80) {
      this._currentSpeed = Math.max(80, this.config.initialSpeed - Math.floor(this._score / 3) * 3)
    }
  }

  /**
   * 开始游戏
   */
  start(): void {
    if (this._gameRunning && !this._gamePaused) return
    
    if (this._gameOver) {
      this.reset()
    }
    
    this._gameRunning = true
    this._gamePaused = false
    this._gameOver = false
  }

  /**
   * 暂停/继续游戏
   */
  togglePause(): void {
    if (!this._gameRunning || this._gameOver) return
    this._gamePaused = !this._gamePaused
  }

  /**
   * 重置游戏
   */
  reset(): void {
    this.snake.reset()
    this._score = 0
    this._gameRunning = false
    this._gamePaused = false
    this._gameOver = false
    this._currentSpeed = this.config.initialSpeed
    this.food.generate(this.snake.body)
  }
}