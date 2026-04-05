# turborepo初始仓库模板

基于 Turborepo 的全栈 Monorepo 项目

## 技术栈

### 前端 (apps/web)
- **React 19** - UI 框架
- **Next.js 16** - React 框架
- **Tailwind CSS 4** - 样式方案
- **Axios** - HTTP 客户端
- **Zustand** - 状态管理

### 后端 (apps/backend)
- **NestJS 11** - Node.js 框架
- **TypeORM** - ORM
- **MySQL** - 数据库
- **Nestia** - 类型安全的 API 开发

### 共享包
- **@repo/shared** - 共享类型和常量
- **@repo/ui** - 共享 UI 组件
- **@repo/eslint-config** - ESLint 配置
- **@repo/typescript-config** - TypeScript 配置

## 项目结构

```
turing-lab-platform/
├── apps/
│   ├── web/              # 前端应用 (Next.js)
│   │   ├── app/          # Next.js App Router
│   │   ├── lib/          # 工具库 (API客户端, 工具函数)
│   │   ├── store/        # Zustand 状态管理
│   │   └── types/        # TypeScript 类型定义
│   └── backend/          # 后端应用 (NestJS)
│       └── src/
│           ├── modules/  # 业务模块
│           └── main.ts   # 入口文件
├── packages/
│   ├── shared/           # 共享类型和常量
│   ├── ui/               # 共享 UI 组件
│   ├── eslint-config/    # ESLint 配置
│   └── typescript-config/# TypeScript 配置
├── turbo.json            # Turborepo 配置
└── pnpm-workspace.yaml   # pnpm workspace 配置
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

#### 后端环境变量 (apps/backend/.env)
```bash
cp apps/backend/.env.example apps/backend/.env
# 编辑 .env 文件，配置数据库连接信息
```

#### 前端环境变量 (apps/web/.env.local)
```bash
# 已创建，默认连接到 http://localhost:3001/api
```

### 3. 创建 MySQL 数据库

```sql
CREATE DATABASE turing_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 启动开发服务器

```bash
# 同时启动前后端
pnpm dev

# 或分别启动
pnpm dev --filter=web      # 只启动前端
pnpm dev --filter=backend  # 只启动后端
```

### 5. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:3001/api
- API 健康检查: http://localhost:3001/api/health

## 可用脚本

```bash
# 开发
pnpm dev              # 启动所有应用的开发服务器

# 构建
pnpm build            # 构建所有应用和包

# 代码检查
pnpm lint             # 运行 ESLint
pnpm check-types      # TypeScript 类型检查

# 格式化
pnpm format           # 使用 Prettier 格式化代码
```

## 数据库迁移

```bash
# 生成迁移文件
cd apps/backend
pnpm migration:generate src/migrations/Init

# 运行迁移
pnpm migration:run

# 回滚迁移
pnpm migration:revert
```

## Nestia API 文档

```bash
cd apps/backend
pnpm nestia  # 生成 Swagger 文档和 SDK
```

## 开发规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 提交前运行 `pnpm lint` 和 `pnpm check-types`
- 使用 Conventional Commits 规范

## License

MIT
