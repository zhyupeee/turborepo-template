/**
 * 后端 SDK 使用示例
 * 
 * 这个文件展示如何在后端使用 Nestia SDK 进行类型验证和文档生成
 */

import { TypedRoute, TypedBody, TypedParam } from '@nestia/core';
import { Controller } from '@nestjs/common';

/**
 * 示例 DTO（实际项目中应该在单独的 dto 文件中定义）
 */
interface IArticle {
  id: string;
  title: string;
  content: string;
  writer: string;
  createdAt: Date;
}

interface ICreateArticle {
  title: string;
  content: string;
  writer: string;
}

interface IUpdateArticle {
  title?: string;
  content?: string;
}

/**
 * 文章管理 Controller
 * 
 * 使用 Nestia 的 @TypedRoute 装饰器，自动：
 * 1. 生成 Swagger 文档
 * 2. 生成前端 SDK
 * 3. 运行时类型验证
 */
@Controller('articles')
export class ArticleController {
  // 模拟数据库
  private articles: IArticle[] = [];

  /**
   * 获取所有文章
   * 
   * Nestia 会自动生成：
   * - Swagger 文档：GET /articles
   * - 前端 SDK：api.functional.articles.findAll()
   * - 返回类型：Promise<IArticle[]>
   */
  @TypedRoute.Get()
  async findAll(): Promise<IArticle[]> {
    return this.articles;
  }

  /**
   * 根据 ID 获取文章
   * 
   * Nestia 会自动生成：
   * - Swagger 文档：GET /articles/:id
   * - 前端 SDK：api.functional.articles.findOne(id)
   * - 返回类型：Promise<IArticle>
   */
  @TypedRoute.Get(':id')
  async findOne(@TypedParam('id') id: string): Promise<IArticle> {
    const article = this.articles.find((a) => a.id === id);
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  /**
   * 创建文章
   * 
   * Nestia 会自动生成：
   * - Swagger 文档：POST /articles
   * - 前端 SDK：api.functional.articles.create({ title, content, writer })
   * - 请求体类型验证：ICreateArticle
   * - 返回类型：Promise<IArticle>
   */
  @TypedRoute.Post()
  async create(@TypedBody() body: ICreateArticle): Promise<IArticle> {
    const newArticle: IArticle = {
      ...body,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
    };
    this.articles.push(newArticle);
    return newArticle;
  }

  /**
   * 更新文章
   * 
   * Nestia 会自动生成：
   * - Swagger 文档：PUT /articles/:id
   * - 前端 SDK：api.functional.articles.update(id, { title, content })
   * - 请求体类型验证：IUpdateArticle
   * - 返回类型：Promise<IArticle>
   */
  @TypedRoute.Put(':id')
  async update(
    @TypedParam('id') id: string,
    @TypedBody() body: IUpdateArticle
  ): Promise<IArticle> {
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }

    this.articles[index] = { ...this.articles[index], ...body } as IArticle;
    return this.articles[index];
  }

  /**
   * 删除文章
   * 
   * Nestia 会自动生成：
   * - Swagger 文档：DELETE /articles/:id
   * - 前端 SDK：api.functional.articles.remove(id)
   * - 返回类型：Promise<void>
   */
  @TypedRoute.Delete(':id')
  async remove(@TypedParam('id') id: string): Promise<void> {
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }
    this.articles.splice(index, 1);
  }
}

/**
 * 使用示例总结
 * 
 * 1. 后端定义 Controller:
 *    - 使用 @TypedRoute 替代标准装饰器
 *    - 使用 @TypedBody 和 @TypedParam 进行类型标注
 *    - 定义清晰的接口类型
 * 
 * 2. 运行 Nestia 生成:
 *    - pnpm nestia (生成 Swagger 和 SDK)
 * 
 * 3. 前端使用 SDK:
 *    - import { api } from '@repo/api'
 *    - const articles = await api.functional.articles.findAll(connection)
 * 
 * 4. 类型安全:
 *    - 前端代码自动获得完整的类型提示
 *    - 编译时就能发现 API 调用错误
 *    - 无需手动维护 API 类型定义
 */
