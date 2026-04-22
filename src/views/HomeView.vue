<template>
  <div class="home">
    <div class="game-intro">
      <h1>🐍 贪吃蛇游戏</h1>
      
      <div class="feature-list">
        <div class="feature-item">
          <span class="emoji">🎮</span>
          <span>方向键控制移动</span>
        </div>
        <div class="feature-item">
          <span class="emoji">⚡</span>
          <span>动态难度，速度递增</span>
        </div>
        <div class="feature-item">
          <span class="emoji">🏆</span>
          <span>最高分本地保存</span>
        </div>
        <div class="feature-item">
          <span class="emoji">⏸️</span>
          <span>空格键暂停/继续</span>
        </div>
      </div>
      <div>
      <router-link to="/snake" class="play-button">
        开始游戏 →
      </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
});
</script>

<style scoped>
.home {
  max-height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.logo {
  width: 120px;
  margin-bottom: 30px;
  animation: fadeIn 0.8s ease-in;
}

.game-intro {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px 60px;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.6s ease-out;
}

h1 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 0px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.feature-list {
  text-align: left;
  margin: 30px 0;
  display: inline-block;
}

.feature-item {
  padding: 10px 0;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
}

.emoji {
  font-size: 20px;
  width: 30px;
  display: inline-block;
}

.play-button {
  margin: 20px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #4ecdc4, #44bdae);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.play-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(78, 205, 196, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>