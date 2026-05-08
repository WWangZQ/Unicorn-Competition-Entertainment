# KGTI - 科广TI 人格测试平台

港科广专属人格测试 Web 应用。5 大模型 × 15 维度 × 27 种人格。

## 快速开始

### Docker（推荐）

```bash
docker compose up -d
# 打开 http://localhost
```

### 开发模式

```bash
# 前端
cd frontend && npm install && npm run dev
# → http://localhost:5173

# 后端
cd backend && npm install && npm run dev
# → http://localhost:3001
```

## 项目结构

```
web/
├── docker-compose.yml
├── SPEC.md                    # 详细规格书
├── README.md
├── frontend/                  # React + Vite + TypeScript
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── data/              # 题目、人格、维度定义
│       ├── utils/             # 计分引擎、存储、API
│       ├── components/        # 通用组件
│       └── pages/             # 页面
└── backend/                   # Express + TypeScript + SQLite
    ├── Dockerfile
    └── src/
        └── routes/            # stats, questions, personalities
```

## 路由

| 路由 | 页面 |
|------|------|
| `/` | 首页 |
| `/quiz` | 答题（30题 + 2道热身） |
| `/result` | 人格结果 + 维度分析 + 分享 |
| `/gallery` | 27种人格图鉴 |
| `/admin` | 管理后台（题目/人格/统计） |

## 技术栈

- React 19 + Vite + TypeScript
- Express 5 + better-sqlite3
- Docker + Nginx
- html2canvas（图片导出）
