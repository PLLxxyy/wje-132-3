# 建筑施工安全管理平台 safety-platform

## Docker 快速启动

```bash
cp .env.example .env
docker compose up -d
```

访问地址：

- 前端页面：http://localhost:18702
- 后端 API：http://localhost:19202/api/health
- MySQL：localhost:23306

停止服务：

```bash
docker compose down -v
```

## 项目介绍

`safety-platform` 是面向工地安全管理员、监理人员、巡检人员和班组施工人员的全栈安全管理平台。系统覆盖安全事件、检查计划、培训签到、资质审核和审计日志，前端与后端职责按领域拆分，便于验证跨文件协同开发能力。

## 功能列表

- 安全概览仪表盘：近 30 天事件趋势、风险等级分布、待整改项、本月培训完成率。
- 事件管理：事件上报、图片上传、严重等级/状态筛选、调查指派、整改提交、事件关闭、时间线详情。
- 检查管理：检查计划列表、逐项合格勾选、隐患数量与评分生成、报告输出。
- 培训管理：培训日历、培训详情、签到表、成绩表、培训记录导出。
- 资质审核：待审核列表、资质详情、证书照片预览、过期预警、审核通过/驳回。
- RBAC 权限控制：Admin / SafetyManager / Inspector / Worker，前后端均有角色约束。
- 审计日志：记录事件、检查、培训、资质等安全操作。
- 全局异常处理：后端统一异常过滤，前端 ErrorBoundary 和 API 拦截器。

## 本地开发方式

后端：

```bash
cd backend
npm install
npm run start:dev
```

前端：

```bash
cd frontend
npm install
npm run dev
```

本地 Vite 开发服务默认端口为 `18702`，会把 `/api` 代理到 `http://127.0.0.1:19202`。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 18、TypeScript、Vite、Ant Design 5 |
| 图表 | ECharts、echarts-for-react |
| 状态管理 | Zustand |
| 后端 | NestJS、TypeScript |
| 数据库 | MySQL 8.0 |
| ORM | TypeORM |
| 认证 | JWT |
| 文件上传 | Multer、本地 uploads 存储 |
| 部署 | Docker Compose、Nginx |

## 目录结构

```text
.
├── docker-compose.yml
├── .env.example
├── frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src
│       ├── api
│       ├── components/common
│       ├── constants
│       ├── hooks
│       ├── pages
│       ├── router
│       ├── stores
│       ├── types
│       └── utils
└── backend
    ├── Dockerfile
    └── src
        ├── config
        ├── controllers
        ├── database
        ├── middlewares
        ├── models
        ├── routes
        ├── services
        ├── types
        └── utils
```

## 环境变量说明

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| COMPOSE_PROJECT_NAME | safety-platform | Compose 项目前缀 |
| FRONTEND_PORT | 18702 | 前端宿主机端口 |
| BACKEND_PORT | 19202 | 后端宿主机端口 |
| MYSQL_PORT | 23306 | MySQL 宿主机端口 |
| MYSQL_DATABASE | safety_platform | 数据库名称 |
| MYSQL_USER | safety_user | 数据库用户 |
| MYSQL_PASSWORD | safety_password | 数据库密码 |
| MYSQL_ROOT_PASSWORD | safety_root_password | MySQL root 密码 |
| JWT_SECRET | safety_platform_local_secret | JWT 签名密钥 |
| UPLOAD_DIR | uploads | 后端上传目录 |

## 共享枚举出现位置

### SeverityLevel

- 后端定义：`backend/src/types/enums.ts`
- 后端实体：`backend/src/models/incident.entity.ts`
- 后端服务：`backend/src/services/incident.service.ts`
- 后端种子：`backend/src/database/seeds/seed.service.ts`
- 前端定义：`frontend/src/types/enums.ts`
- 前端常量：`frontend/src/constants/severityColors.ts`
- 前端工具：`frontend/src/utils/getSeverityColor.ts`
- 前端组件：`frontend/src/components/common/RiskLevelTag.tsx`
- 前端页面：`frontend/src/pages/Dashboard.tsx`、`frontend/src/pages/IncidentManage.tsx`、`frontend/src/pages/CertReview.tsx`

### IncidentStatus

- 后端定义：`backend/src/types/enums.ts`
- 后端实体：`backend/src/models/incident.entity.ts`
- 后端服务：`backend/src/services/incident.service.ts`
- 后端种子：`backend/src/database/seeds/seed.service.ts`
- 前端定义：`frontend/src/types/enums.ts`
- 前端类型：`frontend/src/types/incident.ts`
- 前端组件：`frontend/src/components/common/StatusBadge.tsx`
- 前端页面：`frontend/src/pages/Dashboard.tsx`、`frontend/src/pages/IncidentManage.tsx`

### InspectionType

- 后端定义：`backend/src/types/enums.ts`
- 后端实体：`backend/src/models/inspection.entity.ts`
- 后端种子：`backend/src/database/seeds/seed.service.ts`
- 前端定义：`frontend/src/types/enums.ts`
- 前端类型：`frontend/src/types/inspection.ts`
- 前端页面：`frontend/src/pages/InspectionManage.tsx`

### CertStatus

- 后端定义：`backend/src/types/enums.ts`
- 后端实体：`backend/src/models/certification.entity.ts`
- 后端服务：`backend/src/services/certification.service.ts`
- 后端控制器：`backend/src/controllers/certification.controller.ts`
- 后端种子：`backend/src/database/seeds/seed.service.ts`
- 前端定义：`frontend/src/types/enums.ts`
- 前端类型：`frontend/src/types/certification.ts`
- 前端 API：`frontend/src/api/certification.ts`
- 前端 Store：`frontend/src/stores/certificationStore.ts`
- 前端组件：`frontend/src/components/common/StatusBadge.tsx`
- 前端页面：`frontend/src/pages/CertReview.tsx`

## License

MIT
