<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <ul>
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/snake">贪吃蛇游戏</router-link></li>
        <li><router-link to="/about">关于</router-link></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 15px;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.navbar a:hover {
  background-color: #4ecdc4;
}

/* 激活路由的样式 */
.router-link-active {
  background-color: #e74c3c;
  color: white;
}
</style>