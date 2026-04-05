# Nestia SDK 使用指南

本指南展示如何在后端配合 Nestia SDK 给前端使用。

## 📋 目录

1. [架构概述](#架构概述)
2. [后端配置](#后端配置)
3. [前端配置](#前端配置)
4. [使用示例](#使用示例)
5. [最佳实践](#最佳实践)

---

## 架构概述

```
┌─────────────────┐      Nestia SDK      ┌─────────────────┐
│   后端 NestJS    │ ──────────────────> │   前端 React    │
│                 │   自动生成类型安全    │                 │
│  @TypedRoute    │      的 API 客户端     │  api.functional  │
│  @TypedBody     │                      │                 │
│  @TypedParam    │                      │                 │
└─────────────────┘                      └─────────────────┘
        │                                        │
        │                                        │
        ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│  Swagger 文档    │                      │   类型提示      │
│  运行时验证      │                      │   编译时检查    │
└─────────────────┘                      └─────────────────┘
```

---

## 后端配置

### 1. 安装依赖

```bash
pnpm add @nestia/core @nestia/sdk typia
pnpm add -D nestia
```

### 2. 配置 nestia.config.ts

```typescript
import { INestiaConfig } from "@nestia/sdk";

const config: INestiaConfig = {
  input: ["src/**/*.controller.ts"],
  output: "../../packages/api/src",
  swagger: {
    output: "swagger.json",
    beautify: true,
  },
  simulate: true,
};

export default config;
```

### 3. 使用 Nestia 装饰器

```typescript
import { TypedRoute, TypedBody, TypedParam } from '@nestia/core';
import { Controller } from '@nestjs/common';

@Controller('users')
export class UserController {
  @TypedRoute.Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @TypedRoute.Get(':id')
  async findOne(@TypedParam('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @TypedRoute.Post()
  async create(@TypedBody() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @TypedRoute.Put(':id')
  async update(
    @TypedParam('id') id: string,
    @TypedBody() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, dto);
  }

  @TypedRoute.Delete(':id')
  async remove(@TypedParam('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
```

### 4. 生成 SDK

```bash
pnpm --filter @repo/backend nestia
```

---

## 前端配置

### 1. 配置路径别名

**vite.config.ts**
```typescript
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@repo/api": path.resolve(__dirname, "../../packages/api/src"),
    },
  },
});
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "paths": {
      "@repo/api": ["../../packages/api/src"],
      "@repo/api/*": ["../../packages/api/src/*"]
    }
  }
}
```

### 2. 使用 SDK

```typescript
import { api } from '@repo/api';
import type { IConnection } from '@nestia/fetcher';

// 配置连接
const connection: IConnection = {
  host: 'http://localhost:3001',
};

// 调用 API
const users = await api.functional.users.findAll(connection);
const user = await api.functional.users.findOne(connection, userId);
const newUser = await api.functional.users.create(connection, userData);
```

---

## 使用示例

### 后端 Controller 示例

```typescript
// apps/backend/src/modules/user/user.controller.ts
import { TypedRoute, TypedBody, TypedParam } from '@nestia/core';
import { Controller } from '@nestjs/common';

interface IUser {
  id: string;
  email: string;
  username: string;
}

interface ICreateUser {
  email: string;
  username: string;
  password: string;
}

@Controller('users')
export class UserController {
  @TypedRoute.Get()
  async findAll(): Promise<IUser[]> {
    // 实现代码
  }

  @TypedRoute.Post()
  async create(@TypedBody() body: ICreateUser): Promise<IUser> {
    // 实现代码
  }
}
```

### 前端 React 组件示例

```tsx
// apps/web/src/components/UserList.tsx
import { useState, useEffect } from 'react';
import { api } from '@repo/api';
import type { IConnection } from '@nestia/fetcher';

const connection: IConnection = { host: 'http://localhost:3001' };

export function UserList() {
  const [users, setUsers] = useState<api.User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userList = await api.functional.users.findAll(connection);
        setUsers(userList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>用户列表</h1>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 前端 Hook 示例

```typescript
// apps/web/src/hooks/useUsers.ts
import { useState, useCallback } from 'react';
import { api } from '@repo/api';
import type { IConnection } from '@nestia/fetcher';

const connection: IConnection = { host: 'http://localhost:3001' };

export function useUsers() {
  const [users, setUsers] = useState<api.User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const userList = await api.functional.users.findAll(connection);
      setUsers(userList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: api.CreateUserDto) => {
    const newUser = await api.functional.users.create(connection, data);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    await api.functional.users.remove(connection, id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return { users, loading, loadUsers, createUser, deleteUser };
}
```

---

## 最佳实践

### 1. 类型定义

✅ **推荐**: 使用接口定义清晰的类型
```typescript
interface IUser {
  id: string;
  email: string;
  username: string;
}
```

❌ **不推荐**: 使用 `any` 类型
```typescript
async findAll(): Promise<any> { }
```

### 2. 错误处理

```typescript
try {
  const users = await api.functional.users.findAll(connection);
} catch (error) {
  if (error instanceof HttpClient.FetchError) {
    console.error('API 调用失败:', error.status);
  } else {
    console.error('未知错误:', error);
  }
}
```

### 3. 连接管理

```typescript
// 创建统一的连接配置
const API_CONNECTION: IConnection = {
  host: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};

// 在应用启动时初始化
export const apiClient = {
  connection: API_CONNECTION,
};
```

### 4. 代码组织

```
apps/
├── backend/
│   └── src/
│       ├── modules/
│       │   └── user/
│       │       ├── user.controller.ts    # 使用 @TypedRoute
│       │       ├── user.service.ts
│       │       └── user.dto.ts
├── web/
│   └── src/
│       ├── api/
│       │   └── sdk.ts                    # SDK 连接配置
│       ├── hooks/
│       │   └── useUsers.ts               # 使用 SDK 的 Hooks
│       └── components/
│           └── UserList.tsx              # 使用 SDK 的组件
packages/
└── api/
    └── src/
        ├── index.ts                      # 生成的 SDK
        ├── functional/                   # 功能 API
        └── structures/                   # 数据结构
```

---

## 工作流程

1. **后端开发**
   - 定义 Controller，使用 `@TypedRoute` 装饰器
   - 定义 DTO 接口
   - 实现业务逻辑

2. **生成 SDK**
   - 运行 `pnpm nestia`
   - 自动生成 Swagger 文档和前端 SDK

3. **前端开发**
   - 导入 SDK：`import { api } from '@repo/api'`
   - 使用类型安全的 API 调用
   - 享受完整的类型提示和自动补全

4. **持续开发**
   - 后端 API 变更时，重新运行 `pnpm nestia`
   - 前端自动获得最新的类型定义
   - TypeScript 会标记所有不兼容的调用

---

## 完整示例文件

- 后端示例：[apps/backend/src/examples/article.controller.ts](../../../apps/backend/src/examples/article.controller.ts)
- 前端 SDK 使用：[apps/web/src/examples/sdk-usage.ts](../../../apps/web/src/examples/sdk-usage.ts)
- React 组件示例：[apps/web/src/examples/UserManagement.tsx](../../../apps/web/src/examples/UserManagement.tsx)

---

## 参考链接

- [Nestia 官方文档](https://nestia.io/)
- [NestJS 官方文档](https://docs.nestjs.com/)
- [Typia 官方文档](https://typia.io/)
