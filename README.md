# 🐍 贪吃蛇游戏 (Snake Game)

基于 **Vue 3 + TypeScript + HTML5 Canvas** 开发的经典贪吃蛇游戏。

## ✨ 功能特性

- 🎮 方向键控制蛇的移动
- ⚡ 动态难度 - 蛇身越长速度越快
- 🏆 最高分本地记录
- ⏸️ 空格键暂停/继续游戏
- 🎨 现代化界面设计

## 🛠️ 技术栈

- Vue 3
- TypeScript
- Vue Router 4
- HTML5 Canvas

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run serve
```

### 构建生产版本

```bash
npm run build
```

## 🎮 游戏操作

| 按键 | 功能 |
|------|------|
| ↑ ↓ ← → | 控制方向 |
| 空格 | 暂停/继续 |

## 📜 游戏规则

1. 控制蛇吃掉红色食物，每吃一个得1分
2. 撞墙或撞到自己身体游戏结束
3. 蛇身越长，移动速度越快

## 📁 项目结构

```
src/
├── components/
│   └── SnakeGame.vue   # 游戏主组件
├── views/
│   ├── HomeView.vue    # 首页
│   └── AboutView.vue   # 关于页面
├── router/
│   └── index.ts        # 路由配置
├── App.vue
└── main.ts
```


---
🎉 享受游戏！