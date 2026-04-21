<template>
  <div class="snake-game">
    <div class="game-header">
      <h2>贪吃蛇游戏 🐍</h2>
      <div class="score-board">
        <div>当前分数: <span class="score">{{ score }}</span></div>
        <div>最高分: <span class="high-score">{{ highScore }}</span></div>
      </div>
    </div>

    <canvas
      ref="canvasRef"
      :width="canvasSize"
      :height="canvasSize"
      class="game-canvas"
      tabindex="0"
      @keydown="handleKeydown"
    ></canvas>

    <div class="game-controls">
      <button @click="startGame" :disabled="gameRunning">
        {{ gameRunning ? '游戏中' : '开始游戏' }}
      </button>
      <button @click="pauseGame" :disabled="!gameRunning">
        {{ gamePaused ? '继续' : '暂停' }}
      </button>
      <button @click="resetGame">重置</button>
    </div>

    <div v-if="gameOver" class="game-over">
      <p>游戏结束！</p>
      <p>最终得分: {{ score }}</p>
      <button @click="startGame">再玩一次</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// 游戏配置
const GRID_SIZE = 20 // 20x20 网格
const CELL_SIZE = 20 // 每个格子20px
const canvasSize = GRID_SIZE * CELL_SIZE // 400px
const INITIAL_SPEED = 150 // 初始速度(ms)

// 响应式数据
const canvasRef = ref(null)
let ctx = null

const score = ref(0)
const highScore = ref(0)
const gameRunning = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)

// 游戏状态
let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 }
]
let food = { x: 15, y: 10 }
let direction = 'RIGHT'
let nextDirection = 'RIGHT'
let gameLoop = null
let currentSpeed = INITIAL_SPEED

// 方向映射
const directionMap = {
  'UP': { x: 0, y: -1 },
  'DOWN': { x: 0, y: 1 },
  'LEFT': { x: -1, y: 0 },
  'RIGHT': { x: 1, y: 0 }
}

// 反向方向（防止180度转弯）
const oppositeDirection = {
  'UP': 'DOWN',
  'DOWN': 'UP',
  'LEFT': 'RIGHT',
  'RIGHT': 'LEFT'
}

// 初始化画布
onMounted(() => {
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  canvas.focus()
  loadHighScore()
  drawGame() // 绘制初始状态
})

// 绘制游戏
const drawGame = () => {
  if (!ctx) return
  
  // 清空画布
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, canvasSize, canvasSize)
  
  // 绘制网格
  drawGrid()
  
  // 绘制食物
  drawFood()
  
  // 绘制蛇
  drawSnake()
}

// 绘制网格
const drawGrid = () => {
  ctx.strokeStyle = '#16213e'
  ctx.lineWidth = 0.5
  
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath()
    ctx.moveTo(i * CELL_SIZE, 0)
    ctx.lineTo(i * CELL_SIZE, canvasSize)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(0, i * CELL_SIZE)
    ctx.lineTo(canvasSize, i * CELL_SIZE)
    ctx.stroke()
  }
}

// 绘制蛇
const drawSnake = () => {
  snake.forEach((segment, index) => {
    const isHead = index === 0
    const gradient = ctx.createLinearGradient(
      segment.x * CELL_SIZE,
      segment.y * CELL_SIZE,
      (segment.x + 1) * CELL_SIZE,
      (segment.y + 1) * CELL_SIZE
    )
    
    if (isHead) {
      gradient.addColorStop(0, '#4ecdc4')
      gradient.addColorStop(1, '#44bdae')
    } else {
      gradient.addColorStop(0, '#2ecc71')
      gradient.addColorStop(1, '#27ae60')
    }
    
    ctx.fillStyle = gradient
    ctx.fillRect(
      segment.x * CELL_SIZE,
      segment.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    )
    
    // 蛇的眼睛（头部）
    if (isHead) {
      ctx.fillStyle = 'white'
      const eyeSize = 3
      const eyeOffset = 5
      
      if (direction === 'RIGHT') {
        ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + 5, eyeSize, eyeSize)
        ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - 8, eyeSize, eyeSize)
      } else if (direction === 'LEFT') {
        ctx.fillRect(segment.x * CELL_SIZE + 2, segment.y * CELL_SIZE + 5, eyeSize, eyeSize)
        ctx.fillRect(segment.x * CELL_SIZE + 2, segment.y * CELL_SIZE + CELL_SIZE - 8, eyeSize, eyeSize)
      } else if (direction === 'UP') {
        ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 2, eyeSize, eyeSize)
        ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - 8, segment.y * CELL_SIZE + 2, eyeSize, eyeSize)
      } else {
        ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + CELL_SIZE - 5, eyeSize, eyeSize)
        ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - 8, segment.y * CELL_SIZE + CELL_SIZE - 5, eyeSize, eyeSize)
      }
    }
  })
}

// 绘制食物
const drawFood = () => {
  ctx.fillStyle = '#e74c3c'
  ctx.shadowBlur = 10
  ctx.shadowColor = '#e74c3c'
  ctx.fillRect(
    food.x * CELL_SIZE,
    food.y * CELL_SIZE,
    CELL_SIZE - 1,
    CELL_SIZE - 1
  )
  ctx.shadowBlur = 0
  
  // 添加内发光效果
  ctx.fillStyle = '#ff6b6b'
  ctx.fillRect(
    food.x * CELL_SIZE + 4,
    food.y * CELL_SIZE + 4,
    CELL_SIZE - 9,
    CELL_SIZE - 9
  )
}

// 生成新食物
const generateFood = () => {
  const maxAttempts = 1000
  for (let i = 0; i < maxAttempts; i++) {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    
    // 确保食物不在蛇身上
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    
    if (!isOnSnake) {
      food = newFood
      return true
    }
  }
  
  // 如果几乎找不到位置（游戏胜利）
  return false
}

// 移动蛇
const moveSnake = () => {
  // 更新方向
  direction = nextDirection
  
  // 计算新头部位置
  const move = directionMap[direction]
  const newHead = {
    x: snake[0].x + move.x,
    y: snake[0].y + move.y
  }
  
  // 检查是否吃到食物
  const willEat = newHead.x === food.x && newHead.y === food.y
  
  // 插入新头部
  snake.unshift(newHead)
  
  // 如果没有吃到食物，移除尾部
  if (!willEat) {
    snake.pop()
  } else {
    // 吃到食物，增加分数
    score.value++
    updateHighScore()
    
    // 增加速度（难度提升）
    if (currentSpeed > 80) {
      currentSpeed -= 3
      resetGameLoop()
    }
    
    // 生成新食物
    const foodGenerated = generateFood()
    if (!foodGenerated) {
      // 胜利！蛇已经占满整个网格
      gameOver.value = true
      gameRunning.value = false
      clearInterval(gameLoop)
      return
    }
  }
  
  // 检查碰撞
  if (checkCollision()) {
    endGame()
    return
  }
  
  // 重新绘制
  drawGame()
}

// 检查碰撞
const checkCollision = () => {
  const head = snake[0]
  
  // 墙壁碰撞
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true
  }
  
  // 自身碰撞（跳过头部）
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true
    }
  }
  
  return false
}

// 键盘控制
const handleKeydown = (e) => {
  const keyMap = {
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT'
  }
  
  const newDir = keyMap[e.key]
  if (newDir && oppositeDirection[newDir] !== direction) {
    nextDirection = newDir
    e.preventDefault()
  }
  
  // 空格键暂停/继续
  if (e.key === ' ' || e.key === 'Space') {
    e.preventDefault()
    if (gameRunning.value && !gameOver.value) {
      pauseGame()
    }
  }
}

// 开始游戏
const startGame = () => {
  if (gameRunning.value && !gamePaused.value) return
  
  if (gameOver.value) {
    resetGame()
  }
  
  gameRunning.value = true
  gamePaused.value = false
  gameOver.value = false
  
  resetGameLoop()
  canvasRef.value.focus()
}

// 暂停游戏
const pauseGame = () => {
  if (!gameRunning.value || gameOver.value) return
  
  gamePaused.value = !gamePaused.value
  
  if (gamePaused.value) {
    clearInterval(gameLoop)
    gameLoop = null
    // 显示暂停文字
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, canvasSize, canvasSize)
    ctx.fillStyle = 'white'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('暂停中', canvasSize / 2, canvasSize / 2)
  } else {
    resetGameLoop()
  }
}

// 重置游戏循环
const resetGameLoop = () => {
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(() => {
    if (gameRunning.value && !gamePaused.value && !gameOver.value) {
      moveSnake()
    }
  }, currentSpeed)
}

// 重置游戏
const resetGame = () => {
  clearInterval(gameLoop)
  
  // 重置变量
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 }
  ]
  direction = 'RIGHT'
  nextDirection = 'RIGHT'
  score.value = 0
  currentSpeed = INITIAL_SPEED
  gameRunning.value = false
  gamePaused.value = false
  gameOver.value = false
  
  // 生成有效食物
  generateFood()
  
  // 重新绘制
  drawGame()
}

// 结束游戏
const endGame = () => {
  gameRunning.value = false
  gameOver.value = true
  clearInterval(gameLoop)
  gameLoop = null
  
  // 显示游戏结束画面
  ctx.fillStyle = 'rgba(0,0,0,0.8)'
  ctx.fillRect(0, 0, canvasSize, canvasSize)
  ctx.fillStyle = '#e74c3c'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('游戏结束', canvasSize / 2, canvasSize / 2 - 20)
  ctx.font = '16px Arial'
  ctx.fillStyle = 'white'
  ctx.fillText(`得分: ${score.value}`, canvasSize / 2, canvasSize / 2 + 20)
}

// 更新最高分
const updateHighScore = () => {
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('snakeHighScore', highScore.value)
  }
}

// 加载最高分
const loadHighScore = () => {
  const saved = localStorage.getItem('snakeHighScore')
  if (saved) {
    highScore.value = parseInt(saved)
  }
}

// 清理定时器
onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
})
</script>

<style scoped>
.snake-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

.game-header {
  text-align: center;
  margin-bottom: 20px;
}

.score-board {
  display: flex;
  gap: 30px;
  font-size: 18px;
  font-weight: bold;
}

.score, .high-score {
  color: #4ecdc4;
  font-size: 24px;
  margin-left: 10px;
}

.game-canvas {
  border: 2px solid #4ecdc4;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  cursor: pointer;
  outline: none;
}

.game-canvas:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
}

.game-controls {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.game-controls button {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #4ecdc4;
  color: white;
}

.game-controls button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.4);
}

.game-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.95);
  color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  z-index: 1000;
  border: 2px solid #e74c3c;
}

.game-over button {
  margin-top: 15px;
  padding: 8px 20px;
  background-color: #4ecdc4;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.game-over button:hover {
  background-color: #44bdae;
}
</style>