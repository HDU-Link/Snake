<template>
  <div class="snake-game">
    <div class="game-header">
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
      @click="focusCanvas"
    ></canvas>

    <div class="game-controls">
      <button @click="startGame" :disabled="gameRunning && !gamePaused">
        {{ gameRunning && !gamePaused ? '游戏中' : '开始游戏' }}
      </button>
      <button @click="togglePause" :disabled="!gameRunning || gameOver">
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { GameController } from '../game/GameController'
import type { Direction } from '../game/Snake'

const GRID_SIZE = 20
const CELL_SIZE = 20
const canvasSize = GRID_SIZE * CELL_SIZE
const INITIAL_SPEED = 150

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let gameController: GameController | null = null
let gameLoop: number | null = null

const score = ref(0)
const highScore = ref(0)
const gameRunning = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)

const initGameController = () => {
  gameController = new GameController({
    gridSize: GRID_SIZE,
    cellSize: CELL_SIZE,
    initialSpeed: INITIAL_SPEED
  })
}

const syncState = () => {
  if (!gameController) return
  score.value = gameController.score
  gameRunning.value = gameController.gameRunning
  gamePaused.value = gameController.gamePaused
  gameOver.value = gameController.gameOver
}

const drawFood = () => {
  if (!ctx || !gameController) return
  
  const food = gameController.foodPosition
  const cellSize = CELL_SIZE
  const centerX = food.x * cellSize + cellSize / 2
  const centerY = food.y * cellSize + cellSize / 2
  const radius = cellSize / 2 - 2
  
  ctx.shadowBlur = 10
  ctx.shadowColor = '#e74c3c'
  
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#e74c3c'
  ctx.fill()
  
  ctx.shadowBlur = 0
}

const drawSnake = () => {
  if (!ctx || !gameController) return
  
  const snake = gameController.snakeBody
  const direction = gameController.snakeDirection
  const cellSize = CELL_SIZE
  
  snake.forEach((segment, index) => {
    const isHead = index === 0
    const gradient = ctx!.createLinearGradient(
      segment.x * cellSize,
      segment.y * cellSize,
      (segment.x + 1) * cellSize,
      (segment.y + 1) * cellSize
    )
    
    if (isHead) {
      gradient.addColorStop(0, '#4ecdc4')
      gradient.addColorStop(1, '#44bdae')
    } else {
      gradient.addColorStop(0, '#2ecc71')
      gradient.addColorStop(1, '#27ae60')
    }
    
    ctx!.fillStyle = gradient
    ctx!.fillRect(
      segment.x * cellSize,
      segment.y * cellSize,
      cellSize - 1,
      cellSize - 1
    )
    
    if (isHead) {
      ctx!.fillStyle = 'white'
      const eyeSize = 3
      const eyeOffset = 5
      
      switch (direction) {
        case 'RIGHT':
          ctx!.fillRect(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + 5, eyeSize, eyeSize)
          ctx!.fillRect(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + cellSize - 8, eyeSize, eyeSize)
          break
        case 'LEFT':
          ctx!.fillRect(segment.x * cellSize + 2, segment.y * cellSize + 5, eyeSize, eyeSize)
          ctx!.fillRect(segment.x * cellSize + 2, segment.y * cellSize + cellSize - 8, eyeSize, eyeSize)
          break
        case 'UP':
          ctx!.fillRect(segment.x * cellSize + 5, segment.y * cellSize + 2, eyeSize, eyeSize)
          ctx!.fillRect(segment.x * cellSize + cellSize - 8, segment.y * cellSize + 2, eyeSize, eyeSize)
          break
        case 'DOWN':
          ctx!.fillRect(segment.x * cellSize + 5, segment.y * cellSize + cellSize - 5, eyeSize, eyeSize)
          ctx!.fillRect(segment.x * cellSize + cellSize - 8, segment.y * cellSize + cellSize - 5, eyeSize, eyeSize)
          break
      }
    }
  })
}

const drawPauseOverlay = () => {
  if (!ctx) return
  
  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(0, 0, canvasSize, canvasSize)
  ctx.fillStyle = 'white'
  ctx.font = '20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('暂停中', canvasSize / 2, canvasSize / 2)
}

const drawGameOverOverlay = () => {
  if (!ctx) return
  
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

const drawGame = () => {
  if (!ctx || !gameController) return
  
  const map = gameController.mapInfo
  
  map.clearCanvas(ctx)
  map.drawGrid(ctx)
  
  drawFood()
  drawSnake()
  
  if (gamePaused.value) {
    drawPauseOverlay()
  } else if (gameOver.value) {
    drawGameOverOverlay()
  }
}

const gameTick = () => {
  if (!gameController) return
  
  const continueGame = gameController.update()
  syncState()
  drawGame()
  
  if (gameController.gameOver) {
    if (gameLoop) {
      clearInterval(gameLoop)
      gameLoop = null
    }
    updateHighScore()
  }
}

const startGameLoop = () => {
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }
  
  if (gameController && gameController.gameRunning && !gameController.gameOver && !gameController.gamePaused) {
    gameLoop = window.setInterval(() => {
      gameTick()
    }, gameController.currentSpeed)
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!gameController) return
  
  const keyMap: Record<string, Direction> = {
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT'
  }
  
  const newDir = keyMap[e.key]
  if (newDir) {
    e.preventDefault()
    gameController.setDirection(newDir)
  }
  
  if (e.key === ' ' || e.key === 'Space') {
    e.preventDefault()
    if (gameRunning.value && !gameOver.value) {
      togglePause()
    }
  }
}

const focusCanvas = () => {
  canvasRef.value?.focus()
}

const startGame = () => {
  if (!gameController) return
  
  if (!gameRunning.value || gameOver.value) {
    gameController.start()
    syncState()
    startGameLoop()
    drawGame()
  } else if (gamePaused.value) {
    togglePause()
  }
  
  setTimeout(() => {
    canvasRef.value?.focus()
  }, 100)
}

const togglePause = () => {
  if (!gameController) return
  
  gameController.togglePause()
  syncState()
  
  if (!gamePaused.value) {
    startGameLoop()
  } else {
    if (gameLoop) {
      clearInterval(gameLoop)
      gameLoop = null
    }
  }
  drawGame()
}

const resetGame = () => {
  if (!gameController) return
  
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }
  
  gameController.reset()
  syncState()
  drawGame()
  canvasRef.value?.focus()
}

const updateHighScore = () => {
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('snakeHighScore', highScore.value.toString())
  }
}

const loadHighScore = () => {
  const saved = localStorage.getItem('snakeHighScore')
  if (saved) {
    highScore.value = parseInt(saved)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  initGameController()
  loadHighScore()
  drawGame()
  
  // 确保 canvas 可以获得焦点
  canvas.setAttribute('tabindex', '0')
  canvas.focus()
})

onUnmounted(() => {
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }
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