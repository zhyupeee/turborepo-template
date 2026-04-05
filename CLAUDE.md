# CLAUDE.md

## 项目概述

这是 **Turing Lab Platform** - 一个使用 pnpm workspaces 和 Turborepo 构建的全栈 Monorepo 应用程序。

### 技术栈

| 层级 | 技术                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------- |
| 前端 | React 19, Vite 8, Tailwind CSS 4, Zustand 5, TanStack Router, TanStack Query, React Hook Form, Zod, @nestia/fetcher |
| 后端 | NestJS 11, TypeORM 0.3, MySQL, Nestia 4.5, Typia                                                                    |
| 构建 | Turborepo, pnpm workspaces                                                                                          |
| 语言 | TypeScript 5.7+                                                                                                     |

## 项目结构

```
turing-lab-platform/
├── apps/
│   ├── backend/              # NestJS API 服务器 (端口 3001)
│   │   ├── src/
│   │   │   ├── modules/      # 功能模块
│   │   │   │   └── user/     # 用户模块示例
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── nestia.config.ts  # Nestia SDK/Swagger 配置
│   │   └── package.json
│   └── web/                  # React SPA (Vite 开发服务器)
│       ├── src/
│       ├── vite.config.ts
│       └── package.json
├── packages/
│   ├── types/                # 共享 TypeScript 类型
│   ├── ui/                   # 共享 React 组件
│   ├── eslint-config/        # 共享 ESLint 配置
│   └── typescript-config/    # 共享 TypeScript 配置
├── turbo.json                # Turborepo 管道配置
├── pnpm-workspace.yaml       # pnpm workspace 定义
└── package.json              # 根 package.json
```

## 环境须知

- 当前使用的是 **Windows** 环境，注意命令行执行的命令与 Linux 环境不同
- 所有代码注释、日志都必须使用 **中文**
- 所有文件读写（包括命令行读取/写入）必须统一使用 **UTF-8 编码**；在 PowerShell 中请显式添加 `-Encoding utf8`

## 常用命令

```bash
# 开发
pnpm dev                      # 启动所有应用

# 构建
pnpm build                    # 构建所有内容

# 代码检查和类型检查
pnpm lint                     # 检查所有代码
pnpm check-types              # 类型检查所有代码
pnpm format                   # 使用 Prettier 格式化

# 后端特定命令
pnpm --filter @repo/backend dev
pnpm --filter @repo/backend nestia      # 生成 Swagger/SDK
pnpm --filter @repo/backend test

# 前端特定命令
pnpm --filter @repo/web dev
pnpm --filter @repo/web build
```

## 文档与知识检索

### 后端知识

涉及后端实现、框架用法或 API 参考时，优先查阅以下官方文档：

- **NestJS**: `https://docs.nestjs.com/` - 框架核心概念、模块、控制器、提供者
- **TypeORM**: `https://typeorm.io/` - 实体定义、关系、迁移、查询构建器
- **Nestia**: `https://nestia.io/docs/` - TypedRoute、TypedBody、TypedParam 装饰器使用
- **Typia**: `https://typia.io/docs/` - 运行时类型验证、JSON 校验

### 前端知识

涉及前端文档、UI 组件和设计模式时，优先查阅以下官方文档：

- **React**: `https://react.dev/` - 组件、Hooks、状态管理
- **React Hook Form**: `https://react-hook-form.com/` - 高性能表单管理与验证
- **Vite**: `https://vitejs.dev/guide/` - 构建配置、插件、环境变量
- **Tailwind CSS**: `https://tailwindcss.com/docs/` - 工具类、响应式设计、主题配置
- **Zustand**: `https://zustand-demo.pmnd.rs/` - 状态管理、持久化、中间件
- **TanStack Router**: `https://tanstack.com/router/latest` - 类型安全的路由管理
- **TanStack Query**: `https://tanstack.com/query/latest` - 服务端状态管理、数据缓存与同步
- **Zod**: `https://zod.dev/` - TypeScript 优先的模式验证
- **@nestia/fetcher**: `https://nestia.io/docs/sdk/fetcher/` - 类型安全的 HTTP 客户端

### 搜索限制

**严禁**在任何场景搜索 `node_modules`（包括目录搜索、文件搜索、内容搜索，且搜索关键词中也禁止包含 node_modules）。如有需要，必须改为查阅官方文档或使用 Context7 获取信息。

### 深度源码调研

若文档不足以支撑对内部逻辑或源码细节的理解，**严禁**通过阅读反编译代码的方式查看源码。相反，必须使用 **Context7** 工具或 **deepwiki** 获取基于上下文的深度洞察。

### 推荐查阅仓库

- nestjs/nest
- typeorm/typeorm
- samchon/nestia
- samchon/typia
- pmndrs/zustand

## 后端架构

### 模块模式

每个模块包含：

- `*.controller.ts` - 使用 Nestia 类型装饰器的路由
- `*.service.ts` - 业务逻辑
- `*.entity.ts` - TypeORM 实体定义
- `*.dto.ts` - 请求/响应 DTO
- `*.module.ts` - NestJS 模块

### Nestia 集成

```typescript
// 使用 TypedRoute 替代标准装饰器
@TypedRoute.Get()
async findAll(): Promise<User[]>

// 使用 TypedBody/TypedParam 实现类型安全
@TypedRoute.Post()
async create(@TypedBody() dto: CreateUserDto): Promise<User>

@TypedRoute.Get(':id')
async findOne(@TypedParam('id') id: string): Promise<User>
```

### TypeORM 实体模式

```typescript
@Entity("table_name")
export class Entity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

### 统一错误处理规范

所有 API 返回统一的错误格式：

```typescript
{
  success: false,
  message: "用户不存在",
  code: "USER_NOT_FOUND",
}
```

后端使用全局异常过滤器：

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // 统一错误响应处理
  }
}
```

### API 分层规范

严格遵循分层架构：

- **Controller**: 仅处理请求/响应，不写业务逻辑
- **Service**: 负责业务逻辑
- **Repository**: 负责数据访问（TypeORM）

### 日志规范

- 使用 NestJS Logger 或 pino
- 日志级别：
  - `log`: 普通信息
  - `warn`: 警告
  - `error`: 错误
- **禁止**打印敏感信息（密码、token）

### 权限控制

使用 Guard 实现权限控制，基于 RBAC（角色 + 权限）：

```typescript
@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('user:create')
async createUser(@TypedBody() dto: CreateUserDto) {
  // ...
}
```

### 数据校验策略

- **后端**: 使用 Typia 做运行时校验
- **前端**: 使用 Zod 做表单校验
- 所有 DTO 必须可序列化

### Nestia SDK 流程

修改 API 后必须重新生成 SDK：

```bash
# 1. 后端修改 DTO / Controller
# 2. 执行生成命令
pnpm --filter @repo/backend nestia

# 3. 前端自动获得类型安全 API
```

## 前端架构

### 状态管理 (Zustand)

```typescript
import { create } from "zustand";

interface Store {
  data: Type[];
  setData: (data: Type[]) => void;
}

export const useStore = create<Store>((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));
```

### API 调用 (Nestia SDK)

前端请求不直接使用 Axios 拦截器，而是通过封装 Nestia 的 IConnection 和自定义 Fetcher 来实现全局 Auth 注入与错误处理。

```typescript
import { api } from "@repo/api";
import type { IConnection } from "@nestia/fetcher";

// 配置 API 连接
const connection: IConnection = {
  host: "http://localhost:3001/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// 使用 Nestia SDK 调用 API
const users = await api.users.findAll(connection);
const user = await api.users.findOne(connection, userId);
```

### 表单管理 (React Hook Form)

项目使用 **React Hook Form** 进行表单状态管理，结合 **Zod** 进行 schema 验证。

#### 核心优势

- **高性能**：非受控组件方式，最小化重渲染
- **类型安全**：与 Zod schema 完美集成
- **轻量级**：无额外 bundle 体积负担
- **DX 友好**：直观的 API 和完善的类型推断

#### 基本使用模式

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 定义 Zod schema
const userSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  username: z.string().min(3, "用户名至少3个字符"),
  password: z.string().min(6, "密码至少6个字符"),
});

type UserFormData = z.infer<typeof userSchema>;

// 在组件中使用
function UserForm() {
  const {
    register,          // 注册表单字段
    handleSubmit,      // 提交处理函数
    formState: { errors, isSubmitting },  // 表单状态和错误
    reset,              // 重置表单
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    // 调用 API
    await api.users.create(connection, data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register("username")} />
      {errors.username && <span>{errors.username.message}</span>}

      <input {...register("password")} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "提交中..." : "提交"}
      </button>
    </form>
  );
}
```

#### 与 UI 组件集成

结合 `@repo/ui` 组件使用：

```typescript
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>();

  return (
    <form onSubmit={handleSubmit(onLogin)}>
      <Input
        {...register("email")}
        label="邮箱"
        error={errors.email?.message}
      />
      <Input
        {...register("password")}
        type="password"
        label="密码"
        error={errors.password?.message}
      />
      <Button type="submit">登录</Button>
    </form>
  );
}
```

#### 最佳实践

1. **优先使用 Zod 定义表单 schema**，而非在 useForm 中手动定义 rules
2. **使用 `handleSubmit` 处理提交**，避免直接使用 `onSubmit`
3. **利用 `reset()` 重置表单状态**，尤其在提交成功后
4. **使用 `defaultValues` 设置初始值**，而非在组件中手动 setValue
5. **复杂表单拆分为子组件**，通过 `useFormContext` 共享 form 实例
6. **禁用时使用 `disabled` 属性**，而非 `readOnly`

### 样式 (Tailwind CSS 4)

Tailwind 通过 Vite 插件配置，使用标准的 Tailwind 类名。

## 组件架构规范

### Shadcn/UI 操作规范

**禁止在根目录执行 shadcn 指令**。

当需要添加新组件（如 `npx shadcn add`）时，必须：

1. 切换目录：`cd packages/ui`
2. 执行指令：`npx shadcn@latest add <component_name>`
3. 或者使用全局命令：`pnpm --filter @repo/ui exec shadcn add <component_name>`

安装完成后，务必检查 `packages/ui/src/index.ts` 并添加对应的 `export * from "./uiComponents/..."`。

### 项目架构概述

本库采用 Turborepo 管理的 Monorepo 架构：

- **packages/ui**: 基础 UI 组件库（基于 Shadcn/ui），存放无业务逻辑的原子组件
- **apps/web**: 主前端应用（React/Vite），处理具体业务逻辑
- **@repo/ui**: packages/ui 的内部包别名，用于跨包调用

### 组件导入规则 - 强制执行

**禁止跨包相对路径**：在 apps/web 或其他应用中引用基础组件时，严禁使用 `../../packages/ui` 之类的相对路径。

**统一入口**：必须通过 `@repo/ui` 别名导入。

```typescript
// ✅ 正确
import { Button } from "@repo/ui";

// ❌ 错误
import { Button } from "../../../packages/ui/src/uiComponents/button";
```

### 基础 UI 组件导出规范

**存放位置**：所有基础原子组件必须存放在 `packages/ui/src/uiComponents` 文件夹下。

**自动维护入口**：增加新组件（如 `xxx.tsx`）时，必须同时更新 `packages/ui/src/index.ts`。

**导出格式**：

```typescript
export * from "./uiComponents/xxx";
```

**维护要求**：保持导出列表整洁，确保其他应用能通过 `@repo/ui` 直接访问。

### 业务组件分层与组织

**原子层 (packages/ui)**：仅存放通用的、无状态或仅含 UI 状态的组件（如 Button, Input, Modal, Toast）。

**业务层 (apps/web/src/components)**：

- **模块化分类**：严禁将所有组件直接堆放在 components 根目录
- **目录结构**：必须根据业务功能模块新建文件夹进行分类管理

示例结构：

```
src/components/
├── auth/           # 认证相关组件 (LoginCard, RegisterForm)
├── dashboard/      # 仪表盘组件 (Sidebar, StatChart)
├── user/           # 用户相关组件 (AvatarUpload, ProfileHeader)
└── ...
```

**引用逻辑**：业务组件应调用 `@repo/ui` 中的原子组件进行拼装。

### 样式与状态规范

- **Tailwind CSS**：优先使用 Tailwind 进行样式开发
- **类型安全**：所有新组件必须包含完整的 TypeScript Props 定义

## 数据存储与状态管理规范

项目严格区分敏感数据、服务端状态与客户端逻辑状态的存储边界：

### Token 存储 (Cookie)

所有认证令牌（Access/Refresh Token）强制存储在 Cookie 中。这便于后端和 SSR 层进行读写拦截，也是实现"无感刷新"的基础。

### 持久化偏好 (LocalStorage)

仅用于存储不敏感且需跨会话持久的配置，如主题色 (theme)、语言偏好或侧边栏折叠状态。

### 服务端数据状态 (TanStack Query)

- **适用场景**：所有涉及网络请求、需要缓存以及与后端数据库同步的数据。
- **核心职责**：处理数据的获取、缓存、同步、预取（Prefetching）以及 Loading/Error 的声明式处理。

### 纯前端逻辑状态 (Zustand)

- **适用场景**：纯前端 UI 逻辑，不直接依赖后端接口实时同步的状态（如全局 Modal 的开关、多步骤表单的临时中间态、复杂的本地计算逻辑等）。
- **核心职责**：管理跨组件的即时响应式状态，作为轻量级的客户端全局 Store。

### 路由拦截与守卫 (TanStack Router)

前端通过 `beforeLoad` 钩子拦截路由，结合 TanStack Query 的预取能力确保授权合法：

```typescript
import { redirect } from "@tanstack/react-router";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: async ({ context, location }) => {
    // 检查认证状态，context.auth 状态由全局 Provider/Query 维护
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
```

### Token 无感刷新机制 (SSR 层)

- **前端免处理**：无感刷新完全在后端 SSR 层面完成。
- **透明感知**：前端发起的请求由 `@nestia/fetcher` 执行，无需配置 401 拦截器。由于 SSR 层保证了请求发起时 Token 的有效性，前端代码可以假定 API 始终处于授权状态，只需关注业务逻辑。

## 共享包

### 使用共享类型

```typescript
import { SomeType } from "@repo/types";
```

### 使用共享 UI 组件

```typescript
import { Button, Card } from "@repo/ui";
```

## 数据库迁移

```bash
# 实体变更后生成迁移
pnpm --filter @repo/backend migration:generate -- -d src/config/database.config.ts src/migrations/MigrationName

# 执行迁移
pnpm --filter @repo/backend migration:run

# 回滚最后一次迁移
pnpm --filter @repo/backend migration:revert
```

## 接口测试

对于所有接口测试，必须通过以下方式进行：

- 使用 **agent-browser** 技能
- 新建 **Python 脚本** 进行调通测试

**禁止**直接使用 PowerShell、curl 等工具。如无必要，尽量通过单元测试的方式有效、可靠地验收代码。

## 环境配置

### 后端 (.env 在 apps/backend/ 目录)

```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=turing_lab
CORS_ORIGIN=http://localhost:5173
```

### 前端

默认不需要环境文件。如需要可创建 `.env.local`。

## 代码规范

1. **TypeScript**: 启用严格模式
2. **注释**: 所有代码注释、日志必须使用中文
3. **导出**: 组件优先使用命名导出
4. **ESLint**: 遵循 `@repo/eslint-config` 规则
5. **格式化**: 由 Prettier 统一处理

## API 约定

- 基础 URL: `http://localhost:3001/api`
- Swagger 文档: `http://localhost:3001/swagger.json`
- RESTful 模式
- 主键使用 UUID

## 包管理器

- **统一使用**: pnpm workspace

```bash
pnpm --filter <package-name> <command>
```

## 开发端口

| 服务          | 端口 |
| ------------- | ---- |
| 前端 (Vite)   | 5173 |
| 后端 (NestJS) | 3001 |
| MySQL         | 3306 |

## 系统要求

- Node.js >= 18
- pnpm 9.x
- MySQL 8.x
