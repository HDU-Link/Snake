<template>
  <div class="about">
    <h1>关于项目</h1>
    <div class="about-content">
      <p>这是一个使用 Vue 3 + TypeScript + HTML5 Canvas 开发的经典贪吃蛇游戏。</p>
      
      <h2>技术栈</h2>
      <ul>
        <li>Vue 3 Composition API</li>
        <li>TypeScript</li>
        <li>HTML5 Canvas</li>
        <li>Vue Router 4</li>
      </ul>
      
      <h2>项目特点</h2>
      <ul>
        <li>响应式设计，适配不同屏幕</li>
        <li>流畅的游戏动画</li>
        <li>本地存储最高分记录</li>
        <li>动态难度系统</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
});
</script>

<style scoped>
.about {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

h2 {
  color: #4ecdc4;
  margin: 20px 0 10px;
}

ul {
  line-height: 1.8;
  padding-left: 20px;
}

li {
  margin: 8px 0;
}
</style>