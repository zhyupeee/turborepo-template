# AGENTS.md

## 项目概述

这是 **Turing Lab Platform** - 一个使用现代 Web 技术构建的全栈 Monorepo 应用程序。

### 技术栈

#### 前端 (`apps/web`)

- **React 19** - UI 库
- **Vite 8** - 构建工具和开发服务器
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **Zustand 5** - 轻量级状态管理
- **TanStack Router** - 类型安全的路由管理
- **TanStack Query** - 服务端状态管理、数据缓存与同步
- **React Hook Form** - 高性能表单管理与验证
- **Zod** - TypeScript 优先的模式验证
- **@nestia/fetcher** - 类型安全的 HTTP 客户端（Nestia SDK 内置）

#### 后端 (`apps/backend`)

- **NestJS 11** - Node.js 框架
- **TypeORM 0.3** - 数据库 ORM
- **MySQL** - 主数据库
- **Nestia 4.5** - 类型安全的 API 开发，自动生成 SDK 和 Swagger 文档
- **Typia** - 运行时类型验证

#### 共享包 (`packages/`)

- `@repo/types` - 共享 TypeScript 类型定义
- `@repo/ui` - 共享 UI 组件
- `@repo/eslint-config` - 共享 ESLint 配置
- `@repo/typescript-config` - 共享 TypeScript 配置

### Monorepo 结构

```
turing-lab-platform/
├── apps/
│   ├── backend/          # NestJS 后端应用
│   │   ├── src/
│   │   │   ├── modules/  # 功能模块 (user 等)
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── nestia.config.ts
│   │   └── package.json
│   └── web/              # React 前端应用
│       ├── src/
│       ├── vite.config.ts
│       └── package.json
├── packages/
│   ├── types/            # 共享类型
│   ├── ui/               # 共享 UI 组件
│   ├── eslint-config/    # ESLint 配置
│   └── typescript-config/# TypeScript 配置
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 环境须知

- 当前使用的是 **Windows** 环境，注意命令行执行的命令与 Linux 环境不同
- 所有代码注释、日志都必须使用 **中文**
- 所有文件读写（包括命令行读取/写入）必须统一使用 **UTF-8 编码**；在 PowerShell 中请显式添加 `-Encoding utf8`
- 项目使用 `.gitattributes` 统一换行符为 **LF**，确保跨平台协作一致性

### 换行符规范

项目根目录的 `.gitattributes` 文件强制所有文本文件使用 LF 换行符：

```gitattributes
* text=auto eol=lf

*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.json text eol=lf
# ... 其他文本文件类型

*.bat text eol=crlf
*.cmd text eol=crlf
*.ps1 text eol=crlf

*.png binary
*.jpg binary
# ... 其他二进制文件类型
```

**核心规则：**

- 所有源代码文件（`.ts`、`.tsx`、`.js`、`.json` 等）统一使用 LF 换行符
- Windows 脚本文件（`.bat`、`.cmd`、`.ps1`）使用 CRLF 换行符
- 图片、字体等二进制文件标记为 `binary`，避免 Git 尝试转换

**重新规范化现有文件：**

如果需要重新规范化仓库中已有文件的换行符：

```bash
git add --renormalize .
git status
git commit -m "chore: 统一换行符为 LF"
```

## 开发命令

### 根目录 (Monorepo)

```bash
pnpm dev          # 启动所有应用的开发模式
pnpm build        # 构建所有应用和包
pnpm lint         # 检查所有代码
pnpm check-types  # 类型检查所有代码
pnpm format       # 使用 Prettier 格式化代码
```

### 后端 (`apps/backend`)

```bash
pnpm --filter @repo/backend dev          # 启动开发服务器 (端口 3001)
pnpm --filter @repo/backend build        # 构建生产版本
pnpm --filter @repo/backend start        # 启动生产服务器
pnpm --filter @repo/backend lint         # 检查后端代码
pnpm --filter @repo/backend test         # 运行测试
pnpm --filter @repo/backend nestia       # 生成 Swagger 文档和 SDK
pnpm --filter @repo/backend migration:generate  # 生成迁移文件
pnpm --filter @repo/backend migration:run       # 执行迁移
pnpm --filter @repo/backend migration:revert    # 回滚迁移
```

### 前端 (`apps/web`)

```bash
pnpm --filter @repo/web dev       # 启动 Vite 开发服务器
pnpm --filter @repo/web build     # 构建生产版本
pnpm --filter @repo/web preview   # 预览生产构建
pnpm --filter @repo/web lint      # 检查前端代码
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

## 架构模式

> 详细架构说明请参阅 [project-structure.md](./project-structure.md)

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

### 共享类型包规范 (`@repo/types`)

采用 **按业务模块 + 类型用途分层** 的组织方式：

```
packages/types/src/
├── products/                  # 产品业务模块
│   ├── dto/                   # DTO（接口数据结构）
│   │   ├── create-product.request.ts
│   │   └── product.response.ts
│   └── entities/              # 实体类型（数据库模型）
├── user/                      # 用户业务模块
│   ├── dto/
│   └── entities/
├── order/                     # 订单业务模块
│   ├── dto/
│   └── entities/
├── common/                    # 公共类型（分页、响应等）
└── index.ts                   # 统一导出入口
```

**类型分层说明：**
| 目录 | 用途 | 示例 |
|------|------|------|
| `dto/` | 数据传输对象，用于 API 请求/响应 | `CreateProductRequest`, `ProductResponse` |
| `entities/` | 实体类型，对应数据库模型 | `Product`, `User` |
| `enums/` | 枚举类型 | `OrderStatus`, `UserRole` |

**使用方式：**

```typescript
import { CreateProductRequest, ProductResponse } from "@repo/types";
```

**添加新类型步骤：**

1. 在对应业务模块目录下创建文件
2. 在模块 `index.ts` 中导出
3. 在根 `index.ts` 中添加导出

### 共享 UI 组件库规范 (`@repo/ui`)

> **UI 库架构约束** - 强制执行
>
> - **UI 库路径**: `packages/ui`
> - **组件存储**: `packages/ui/src/uiComponents` (由 shadcn 管理)
> - **配置位置**: `packages/ui/components.json`
> - **重要**: UI 库是一个独立的 Workspace，所有 UI 相关的依赖、配置和组件下载逻辑都必须局限在 `packages/ui` 目录内

所有可复用的 React 组件放在 `packages/ui/src/` 下：

```
packages/ui/src/
├── uiComponents/             # 基础原子组件目录
│   ├── button.tsx            # 按钮组件
│   ├── card.tsx              # 卡片组件
│   ├── input.tsx             # 输入框组件
│   └── ...
└── index.ts                  # 统一导出入口
```

**使用方式**：

```typescript
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";
```

**组件规范**：

- 每个组件独立文件
- 必须定义 Props 接口
- 支持 `className` 覆盖默认样式
- 使用命名导出

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

### 后端模块结构

每个功能模块遵循以下模式：

```
modules/{feature}/
├── {feature}.controller.ts  # 使用 Nestia 装饰器的路由
├── {feature}.service.ts     # 业务逻辑
├── {feature}.entity.ts      # TypeORM 实体
├── {feature}.dto.ts         # 数据传输对象
└── {feature}.module.ts      # 模块定义
```

### Nestia 使用规范

- 使用 `@TypedRoute` 装饰器替代标准的 `@Get`、`@Post` 等
- 使用 `@TypedBody()` 替代 `@Body()`
- 使用 `@TypedParam()` 替代 `@Param()`
- 运行 `pnpm nestia` 生成 Swagger 文档和 SDK

示例：

```typescript
@TypedRoute.Get()
async findAll(): Promise<User[]>

@TypedRoute.Post()
async create(@TypedBody() dto: CreateUserDto): Promise<User>

@TypedRoute.Get(':id')
async findOne(@TypedParam('id') id: string): Promise<User>
```

### 前端状态管理

- 使用 Zustand 进行全局状态管理
- 使用 Nestia SDK (`@repo/api`) 进行类型安全的 API 调用
- 前端请求不直接使用 Axios 拦截器，而是通过封装 Nestia 的 IConnection 和自定义 Fetcher 来实现全局 Auth 注入与错误处理
- 共享类型应从 `@repo/types` 或 `@repo/api` 导入

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

#### 表单组件封装建议

对于复杂表单，建议封装为独立表单组件：

```typescript
interface FormProps<T> {
  onSubmit: (data: T) => Promise<void>;
  defaultValues?: Partial<T>;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
}

function Form<T extends z.ZodType>({
  onSubmit,
  defaultValues,
  children,
}: FormProps<z.infer<T>>) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {children(methods)}
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

### 数据存储与状态管理规范

项目严格区分敏感数据、服务端状态与客户端逻辑状态的存储边界：

#### Token 存储 (Cookie)

所有认证令牌（Access/Refresh Token）强制存储在 Cookie 中。这便于后端和 SSR 层进行读写拦截，也是实现"无感刷新"的基础。

#### 持久化偏好 (LocalStorage)

仅用于存储不敏感且需跨会话持久的配置，如主题色 (theme)、语言偏好或侧边栏折叠状态。

#### 服务端数据状态 (TanStack Query)

- **适用场景**：所有涉及网络请求、需要缓存以及与后端数据库同步的数据。
- **核心职责**：处理数据的获取、缓存、同步、预取（Prefetching）以及 Loading/Error 的声明式处理。

#### 纯前端逻辑状态 (Zustand)

- **适用场景**：纯前端 UI 逻辑，不直接依赖后端接口实时同步的状态（如全局 Modal 的开关、多步骤表单的临时中间态、复杂的本地计算逻辑等）。
- **核心职责**：管理跨组件的即时响应式状态，作为轻量级的客户端全局 Store。

#### 路由拦截与守卫 (TanStack Router)

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

#### Token 无感刷新机制 (SSR 层)

- **前端免处理**：无感刷新完全在后端 SSR 层面完成。
- **透明感知**：前端发起的请求由 `@nestia/fetcher` 执行，无需配置 401 拦截器。由于 SSR 层保证了请求发起时 Token 的有效性，前端代码可以假定 API 始终处于授权状态，只需关注业务逻辑。

### 数据库

- MySQL 配合 TypeORM
- 实体使用 UUID 主键
- 包含 `createdAt` 和 `updatedAt` 时间戳
- 使用迁移进行数据库变更

## 接口测试

对于所有接口测试，必须通过以下方式进行：

- 使用 **agent-browser** 技能
- 新建 **Python 脚本** 进行调通测试

**禁止**直接使用 PowerShell、curl 等工具。如无必要，尽量通过单元测试的方式有效、可靠地验收代码。

## 环境变量

### 后端 (.env)

```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=turing_lab
CORS_ORIGIN=http://localhost:5173
```

## 代码风格

- 使用 TypeScript 严格模式
- 遵循 `@repo/eslint-config` 的 ESLint 规则
- 使用 Prettier 进行格式化
- 所有代码注释、日志必须使用中文
- 组件使用命名导出

## API 约定

- 基础路径：`/api`
- RESTful 端点
- 使用 Nestia 实现类型安全的路由
- Swagger 文档生成在 `/swagger.json`

## 包管理器

本项目使用 **pnpm** 的 workspace 功能。始终使用：

```bash
pnpm --filter <package-name> <command>
```

或在特定应用目录下运行命令。

## Node.js 要求

- Node.js >= 18
- pnpm 9.x

## 开发端口

| 服务          | 端口 |
| ------------- | ---- |
| 前端 (Vite)   | 5173 |
| 后端 (NestJS) | 3001 |
| MySQL         | 3306 |
