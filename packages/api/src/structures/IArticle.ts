import type { Format } from "typia/lib/tags/Format";

/**
 * 示例 DTO（实际项目中应该在单独的 dto 文件中定义）
 */
export type IArticle =
  /**
   * 示例 DTO（实际项目中应该在单独的 dto 文件中定义）
   */
  {
    id: string;
    title: string;
    content: string;
    writer: string;
    createdAt: string & Format<"date-time">;
  };
