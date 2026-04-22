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
│   └── SnakeGame.vue        # 游戏主组件（UI界面和用户交互）
├── views/
│   ├── HomeView.vue         # 首页（游戏展示入口）
│   └── AboutView.vue        # 关于页面（游戏开发介绍和说明）
├── router/
│   └── index.ts             # 路由配置
├── game/
│   ├── Food.ts              # 食物类（位置生成和碰撞检测）
│   ├── Snake.ts             # 蛇类（移动、生长、自身碰撞）
│   ├── GameMap.ts           # 地图类（网格绘制和画布管理）
│   └── GameController.ts    # 游戏控制器（状态管理和规则控制）
├── utils/
│   └── random.ts
├── App.vue
└── main.ts
```
---
🎉 享受游戏带来的乐趣吧！祝您玩得愉快，创造属于自己的最高纪录！
