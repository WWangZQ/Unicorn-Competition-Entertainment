# KGTI - 科广TI 人格测试平台

港科广专属人格测试 Web 应用。5 大模型 × 15 维度 × 27 种人格 + 2 种隐藏触发。

对标 SBTI，纯娱乐向，请勿当真。

## 快速开始

### Docker（推荐）

```bash
docker compose up -d --build
# 前端 → http://localhost:3000
# 后端 → http://localhost:3003
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
KGTI/
├── docker-compose.yml
├── SPEC.md
├── README.md
├── personality.md             # 人格设计文档
├── kgti.md                    # 题目设计文档
├── frontend/                  # React 19 + Vite + TypeScript
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── data/              # 题目、人格、维度定义
│       ├── utils/             # 计分引擎、存储、API、身份系统
│       ├── components/        # 通用组件（Pie3D、ShareCard、PersonalityCard等）
│       └── pages/             # 页面
│           └── admin/         # 管理端
└── backend/                   # Express 5 + TypeScript + JSON 文件存储
    ├── Dockerfile
    └── src/
        ├── db.ts              # 数据库操作
        ├── seed.ts            # 初始化数据
        └── routes/            # stats, questions, personalities, identity
```

## 路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | Hero卡片、人格图鉴、热度榜、FAQ |
| `/quiz` | 答题 | 2道隐藏触发 + 30道主线，随机排列 |
| `/result` | 结果 | 人格代码、匹配度、人格描述、15维度分析、分享卡片 |
| `/gallery` | 图鉴 | 按5大模型分组展示27+2种人格 |
| `/types/:code` | 人格详情 | 完整人格档案、维度画像、人格描述 |
| `/history` | 测试记录 | 本机 + 关联设备记录（需连接身份） |
| `/account` | 账号 | 轻量身份系统，连接码跨设备同步 |
| `/admin` | 管理后台 | 题目CRUD、人格配置、数据统计（密码保护） |

## 功能特性

### 测试核心
- **5大模型 × 15维度 × 27种人格** + 2种隐藏触发（????隐藏款 / LAG永久加载中）
- 余弦相似度匹配，每人格有独立维度画像(0-4)
- 题目每次随机排列
- 纯前端计算，不上传答题数据

### 结果展示
- 15维度 H/M/L 评级 + 等级文字描述
- 人格戏谑解读文案（200字/人格）
- Canvas 图片导出分享
- Recharts 环形饼图（悬停弹出 + 数据展示）

### 轻量身份系统
- **免注册**：自动生成 device_id，测试无需登录
- **连接码**：8位码 + 密码连接多设备，同步测试记录
- **账号页**：查看已连接设备、IP、活跃时间
- 密码规则：≥6位，含字母和数字

### 管理端
- 密码保护（`kgti2026`），sessionStorage 认证
- 题目管理：增删改查（主线题/隐藏触发题）
- 人格管理：编辑人格档案、维度分值、触发规则
- 数据统计：参与人数、人格热度分布、3D饼图可视化

### UI
- Claude UI 浅色风（Figtree + Noto Sans SC 字体）
- 响应式适配移动端
- 1100px 宽幅布局

## 技术栈

- **前端**：React 19 + Vite + TypeScript + Recharts + html2canvas
- **后端**：Express 5 + TypeScript + JSON 文件存储
- **部署**：Docker Compose + Nginx 反向代理
- **字体**：Figtree + Noto Sans SC + JetBrains Mono (Google Fonts)

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| 后端端口 | 3001 (容器内) / 3003 (宿主机) | express 监听 |
| 前端端口 | 80 (容器内) / 3000 (宿主机) | nginx 静态服务 |
| 数据存储 | `backend/data/kgti.json` | JSON 文件持久化 |
