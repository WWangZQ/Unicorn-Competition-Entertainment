# KGTI 科广TI — 项目规格书

## 一、项目概述

港科广专属人格测试与校园兴趣连接平台。参考 MBTI、SBTI 趣味人格测试，围绕自习习惯、科研风格、社交方式、活动偏好、DDL 状态等校园行为，打造一套好玩、易传播、有共鸣的人格类型体系。

## 二、技术栈

| 层 | 选型 |
|----|------|
| 前端 | React 19 + Vite 8 + TypeScript 6 |
| 后端 | Express + TypeScript + SQLite |
| 部署 | Docker Compose（Nginx 反代 + Express API） |
| 图片导出 | html2canvas |
| 路由 | React Router v7 |

## 三、项目结构

```
web/
├── docker-compose.yml
├── SPEC.md
├── README.md
│
├── frontend/                    # React SPA
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── App.css
│       ├── data/
│       │   ├── questions.ts      # 30题 + 2隐藏触发
│       │   ├── personalities.ts   # 27人格 + 2特殊
│       │   └── dimensions.ts     # 15维度定义
│       ├── utils/
│       │   ├── scoring.ts        # 计分引擎
│       │   ├── storage.ts        # localStorage 封装
│       │   └── api.ts            # 后端 API 调用
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── QuizPage.tsx
│       │   ├── ResultPage.tsx
│       │   ├── GalleryPage.tsx
│       │   └── admin/
│       │       ├── AdminLayout.tsx
│       │       ├── QuestionManager.tsx
│       │       ├── PersonalityManager.tsx
│       │       └── StatsPage.tsx
│       └── components/
│           ├── ProgressBar.tsx
│           ├── QuestionCard.tsx
│           ├── PersonalityCard.tsx
│           ├── ShareCard.tsx
│           └── Header.tsx
│
└── backend/                     # Express API
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── db.ts
        ├── seed.ts
        └── routes/
            ├── questions.ts
            ├── personalities.ts
            └── stats.ts
```

## 四、路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | HomePage | 品牌入口，开始测试 |
| `/quiz` | QuizPage | 30题一次一题，进度条 |
| `/result` | ResultPage | 人格展示 + 维度雷达 + 分享 |
| `/gallery` | GalleryPage | 27人格卡片墙 |
| `/admin` | AdminLayout | 管理入口 |
| `/admin/questions` | QuestionManager | 题目 CRUD |
| `/admin/personalities` | PersonalityManager | 人格配置 |
| `/admin/stats` | StatsPage | 参与人数、分布统计 |

## 五、计分引擎

```
答题(30题) → 每题选项(0/1/2) → 15维度分(每维0-4)
→ 与27人格特征向量做余弦相似度 → 最高分命中
→ 相似度<60% → ???? 隐藏款
→ 隐藏触发题激活 → LAG 永久加载中
```

## 六、部署架构

```
Port 80
   │
   ▼
┌──────────┐      /api/*       ┌──────────┐
│  nginx   │ ────────────────▶ │ Express  │
│ (React   │                   │ port 3001│
│  SPA)    │                   │ SQLite   │
└──────────┘                   └──────────┘
```

```bash
# 一键启动
docker compose up -d    # → http://localhost

# 开发模式
cd frontend && npm run dev   # → :5173
cd backend && npm run dev    # → :3001
```

## 七、路线图

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 1 | 项目骨架：目录重组、docker-compose、依赖安装 | ⬜ |
| Phase 2 | 数据层：题目/人格数据、计分引擎、localStorage | ⬜ |
| Phase 3 | 用户端：首页→答题→结果→图鉴 完整闭环 | ⬜ |
| Phase 4 | 管理端：题目CRUD、人格配置、统计 | ⬜ |
| Phase 5 | 加分项：html2canvas 图片卡片分享 | ⬜ |
| Phase 6 | 移动端适配、样式打磨 | ⬜ |
| Phase 7 | 后端：Express + SQLite + API | ⬜ |

## 八、UI 风格 — Claude UI

| 要素 | 规范 |
|------|------|
| 底色 | `#1a1a1a` 深色背景 |
| 卡片/容器 | `#252525` 或 `#2a2a2a`，圆角 12px，细边框 `#333` |
| 字体 | 系统等宽优先：`'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` |
| 正文 | system-ui / -apple-system，14-16px |
| 强调色 | 暖橙 `#d97706` / `#f59e0b`，hover 微亮 |
| 文字色 | 主 `#e5e5e5`，次 `#9ca3af`，弱 `#6b7280` |
| 间距 | 宽松留白，卡片内 padding 24px，卡片间距 16px |
| 动效 | hover 微升 2px + shadow，过渡 200ms ease |
| 输入框 | 暗底 + 细边框，focus 时边框变橙 |
| 按钮 | 圆角 8px，主按钮橙色实底 + 白字，次按钮透明 + 边框 |
| 整体感受 | 冷静、克制、开发者审美，像终端里跑出来的精致工具 |
```

## 九、数据源

- `../kgti.md` — 30 道主线题 + 2 道隐藏触发题，SBTI 15 维度标记
- `../personality.md` — 27 种人格 + 2 种特殊触发，含 CODE / 名称 / 一句话
- `../sbti.md` — SBTI 原始题库，参考风格，不直接引用
