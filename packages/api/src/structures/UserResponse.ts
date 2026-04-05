import type { Format } from "typia/lib/tags/Format";

/**
 * 用户响应类型（不包含密码字段）
 */
export type UserResponse =
  /**
   * 用户响应类型（不包含密码字段）
   */
  {
    id: string;
    email: string;
    username: string;
    avatar: null | string;
    isActive: boolean;
    createdAt: string & Format<"date-time">;
    updatedAt: string & Format<"date-time">;
  };
