# Turing Lab Platform 项目架构说明

## 概述

Turing Lab Platform 是一个基于 **pnpm workspaces + Turborepo** 构建的全栈 Monorepo 应用程序。项目采用前后端分离架构，通过共享包实现代码复用和类型安全。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19, Vite 8, Tailwind CSS 4, Zustand 5, Axios |
| 后端 | NestJS 11, TypeORM 0.3, MySQL, Nestia 7.4, Typia |
| 构建 | Turborepo, pnpm workspaces |
| 语言 | TypeScript 5.7+ |

## 目录结构

```
turing-lab-platform/
├── apps/                          # 应用程序目录
│   ├── backend/                   # NestJS 后端应用
│   │   ├── src/
│   │   │   ├── modules/           # 功能模块
│   │   │   │   └── user/          # 用户模块示例
│   │   │   │       ├── user.controller.ts   # 控制器（路由）
│   │   │   │       ├── user.service.ts      # 业务逻辑
│   │   │   │       ├── user.entity.ts       # 数据库实体
│   │   │   │       ├── user.dto.ts          # 数据传输对象
│   │   │   │       └── user.module.ts       # 模块定义
│   │   │   ├── app.module.ts      # 根模块
│   │   │   ├── app.service.ts     # 根服务
│   │   │   └── main.ts            # 入口文件
│   │   ├── nestia.config.ts       # Nestia SDK/Swagger 配置
│   │   └── package.json
│   │
│   └── web/                       # React 前端应用
│       ├── src/
│       │   ├── assets/            # 静态资源
│       │   ├── index.css          # 全局样式
│       │   └── main.tsx           # 入口文件
│       ├── public/                # 公共资源
│       ├── vite.config.ts         # Vite 配置
│       └── package.json
│
├── packages/                      # 共享包目录
│   ├── types/                     # 共享 TypeScript 类型定义
│   │   ├── src/
│   │   │   ├── products/          # 产品业务模块类型
│   │   │   │   └── dto/           # DTO（接口数据结构）
│   │   │   │       └── create-product.request.ts
│   │   │   ├── user/              # 用户业务模块类型（未来扩展）
│   │   │   │   ├── dto/           # 用户相关 DTO
│   │   │   │   └── entities/      # 用户实体类型
│   │   │   ├── order/             # 订单业务模块类型（未来扩展）
│   │   │   │   ├── dto/           # 订单相关 DTO
│   │   │   │   └── entities/      # 订单实体类型
│   │   │   └── index.ts           # 统一导出入口
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                        # 共享 UI 组件库
│   │   ├── src/
│   │   │   ├── button.tsx         # 按钮组件
│   │   │   ├── card.tsx           # 卡片组件
│   │   │   └── code.tsx           # 代码展示组件
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── eslint-config/             # 共享 ESLint 配置
│   │   ├── base.js                # 基础配置
│   │   ├── next.js                # Next.js 配置
│   │   ├── react-internal.js      # React 内部配置
│   │   └── package.json
│   │
│   └── typescript-config/         # 共享 TypeScript 配置
│       ├── base.json              # 基础配置
│       ├── nextjs.json            # Next.js 配置
│       ├── react-library.json     # React 库配置
│       └── package.json
│
├── turbo.json                     # Turborepo 管道配置
├── pnpm-workspace.yaml            # pnpm workspace 定义
├── package.json                   # 根 package.json
├── AGENTS.md                      # AI 代理开发指南
└── CLAUDE.md                      # Claude AI 开发指南
```

## 共享类型包架构 (`@repo/types`)

### 设计原则

共享类型包采用 **按业务模块 + 类型用途分层** 的组织方式，确保：

1. **业务隔离**：每个业务模块独立目录，互不干扰
2. **类型分类**：DTO、Entity、枚举等按用途分目录存放
3. **统一导出**：通过 `index.ts` 统一导出，简化引用路径

### 目录结构详解

```
packages/types/src/
│
├── products/                      # 产品业务模块
│   ├── dto/                       # 数据传输对象
│   │   ├── create-product.request.ts    # 创建产品请求
│   │   ├── update-product.request.ts    # 更新产品请求
│   │   └── product.response.ts          # 产品响应
│   ├── entities/                  # 实体类型（数据库模型）
│   │   └── product.entity.ts
│   └── index.ts                   # 模块统一导出
│
├── user/                          # 用户业务模块（未来扩展）
│   ├── dto/
│   │   ├── create-user.request.ts
│   │   ├── update-user.request.ts
│   │   ├── login.request.ts
│   │   └── user.response.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── index.ts
│
├── order/                         # 订单业务模块（未来扩展）
│   ├── dto/
│   │   ├── create-order.request.ts
│   │   └── order.response.ts
│   ├── entities/
│   │   └── order.entity.ts
│   └── index.ts
│
├── common/                        # 公共类型
│   ├── pagination.ts              # 分页类型
│   ├── response.ts                # 通用响应类型
│   └── index.ts
│
└── index.ts                       # 根统一导出
```

### 类型分层说明

| 目录 | 用途 | 示例 |
|------|------|------|
| `dto/` | 数据传输对象，用于 API 请求/响应 | `CreateProductRequest`, `ProductResponse` |
| `entities/` | 实体类型，对应数据库模型 | `Product`, `User` |
| `enums/` | 枚举类型 | `OrderStatus`, `UserRole` |
| `types/` | 其他辅助类型 | `PaginationParams`, `SortOptions` |

### 使用方式

```typescript
// 从统一入口导入
import { 
  CreateProductRequest, 
  ProductResponse 
} from '@repo/types';

// 或按模块导入（推荐）
import { 
  CreateProductRequest, 
  ProductResponse 
} from '@repo/types/products';
```

### 导出规范

每个业务模块的 `index.ts` 负责导出该模块的所有类型：

```typescript
// packages/types/src/products/index.ts
export * from './dto/create-product.request';
export * from './dto/update-product.request';
export * from './dto/product.response';
export * from './entities/product.entity';
```

根 `index.ts` 汇总所有模块：

```typescript
// packages/types/src/index.ts
export * from './products';
export * from './user';
export * from './order';
export * from './common';
```

## 共享 UI 组件库 (`@repo/ui`)

### 设计原则

UI 组件库存放可复用的 React 组件，遵循以下原则：

1. **组件独立性**：每个组件独立文件，支持按需导入
2. **类型安全**：完整的 TypeScript 类型定义
3. **样式灵活**：支持 `className` 覆盖默认样式

### 目录结构

```
packages/ui/src/
│
├── button.tsx                     # 按钮组件
├── card.tsx                       # 卡片组件
├── code.tsx                       # 代码展示组件
├── input.tsx                      # 输入框组件（未来扩展）
├── modal.tsx                      # 弹窗组件（未来扩展）
├── table.tsx                      # 表格组件（未来扩展）
└── index.ts                       # 统一导出
```

### 使用方式

```typescript
// 按需导入单个组件
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

// 或导入所有组件
import { Button, Card, Code } from '@repo/ui';
```

### 组件规范

每个组件应包含：

```typescript
// 组件 Props 接口定义
interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

// 组件实现
export const Button = ({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'base-button-styles',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## 后端模块架构

### 模块结构

每个后端模块遵循 NestJS 标准结构：

```
modules/{feature}/
├── {feature}.controller.ts    # 路由控制器
├── {feature}.service.ts       # 业务逻辑
├── {feature}.entity.ts        # TypeORM 实体
├── {feature}.dto.ts           # 数据传输对象
├── {feature}.module.ts        # 模块定义
└── {feature}.test.ts          # 单元测试
```

### Nestia 集成

使用 Nestia 实现类型安全的 API：

```typescript
import { TypedRoute, TypedBody, TypedParam } from '@nestia/core';

@Controller('users')
export class UserController {
  @TypedRoute.Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @TypedRoute.Post()
  async create(@TypedBody() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @TypedRoute.Get(':id')
  async findOne(@TypedParam('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
```

## 前端架构

### 状态管理

使用 Zustand 进行全局状态管理：

```typescript
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: false,
}));
```

### API 调用

使用 Axios 进行 HTTP 请求：

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 包依赖关系

```
┌─────────────────────────────────────────────────────────────┐
│                         应用层                               │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │   @repo/web     │              │  @repo/backend  │      │
│  │   (前端应用)     │              │   (后端应用)    │      │
│  └────────┬────────┘              └────────┬────────┘      │
│           │                                │                │
└───────────┼────────────────────────────────┼────────────────┘
            │                                │
            ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│                         共享层                               │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   @repo/types   │  │    @repo/ui     │                  │
│  │  (类型定义)      │  │  (UI 组件)      │                  │
│  └────────┬────────┘  └────────┬────────┘                  │
│           │                    │                            │
└───────────┼────────────────────┼────────────────────────────┘
            │                    │
            ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                         配置层                               │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │@repo/eslint-config│ │@repo/typescript-config│            │
│  │  (ESLint 配置)   │  │ (TypeScript 配置)│                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## 开发端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 (Vite) | 5173 | React 开发服务器 |
| 后端 (NestJS) | 3001 | API 服务器 |
| MySQL | 3306 | 数据库 |

## 常用命令

```bash
# 启动所有应用
pnpm dev

# 构建所有内容
pnpm build

# 代码检查
pnpm lint
pnpm check-types

# 后端特定命令
pnpm --filter @repo/backend dev          # 启动后端开发服务器
pnpm --filter @repo/backend nestia       # 生成 Swagger/SDK
pnpm --filter @repo/backend test         # 运行测试

# 前端特定命令
pnpm --filter @repo/web dev              # 启动前端开发服务器
pnpm --filter @repo/web build            # 构建前端
```

## 扩展指南

### 添加新业务模块类型

1. 在 `packages/types/src/` 下创建新目录（如 `order/`）
2. 按类型用途创建子目录（`dto/`、`entities/` 等）
3. 创建类型文件并导出
4. 在模块 `index.ts` 中导出
5. 在根 `index.ts` 中添加导出

### 添加新 UI 组件

1. 在 `packages/ui/src/` 下创建组件文件
2. 定义 Props 接口
3. 实现组件
4. 在 `index.ts` 中导出（如需要）

### 添加新后端模块

1. 在 `apps/backend/src/modules/` 下创建模块目录
2. 创建必要的文件（controller、service、entity、dto、module）
3. 在 `app.module.ts` 中导入新模块
4. 运行 `pnpm --filter @repo/backend nestia` 更新 SDK

## 系统要求

- Node.js >= 18
- pnpm 9.x
- MySQL 8.x
