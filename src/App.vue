<template>
  <div id="app">
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
  height: 50px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.navbar ul {
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 20px;
  transition: all 0.3s;
}

.navbar a:hover {
  background-color: #4ecdc4;
}

.router-link-active {
  background-color: #e74c3c;
  color: white;
}
</style>