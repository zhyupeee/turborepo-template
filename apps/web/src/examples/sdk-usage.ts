/**
 * 前端使用 Nestia SDK 示例
 *
 * 这个文件展示如何在前端使用 Nestia 生成的 SDK 调用后端 API
 */

import { api } from "@repo/api";
import type { CreateUserDto, UpdateUserDto } from "@repo/api";
import type { IConnection } from "@nestia/fetcher";

// 配置 API 连接
const connection: IConnection = {
  host: "http://localhost:3001/api",
};

/**
 * 示例 1: 获取所有用户
 */
export async function getAllUsers() {
  try {
    const users = await api.users.findAll(connection);
    console.log("所有用户:", users);
    return users;
  } catch (error) {
    console.error("获取用户列表失败:", error);
    throw error;
  }
}

/**
 * 示例 2: 获取单个用户
 */
export async function getUserById(userId: string) {
  try {
    const user = await api.users.findOne(connection, userId);
    console.log("用户信息:", user);
    return user;
  } catch (error) {
    console.error("获取用户失败:", error);
    throw error;
  }
}

/**
 * 示例 3: 创建新用户
 */
export async function createUser(userData: CreateUserDto) {
  try {
    const newUser = await api.users.create(connection, userData);
    console.log("创建的用户:", newUser);
    return newUser;
  } catch (error) {
    console.error("创建用户失败:", error);
    throw error;
  }
}

/**
 * 示例 4: 更新用户信息
 */
export async function updateUser(
  userId: string,
  updateData: UpdateUserDto,
) {
  try {
    const updatedUser = await api.users.update(connection, userId, updateData);
    console.log("更新后的用户:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("更新用户失败:", error);
    throw error;
  }
}

/**
 * 示例 5: 删除用户
 */
export async function deleteUser(userId: string) {
  try {
    await api.users.remove(connection, userId);
    console.log("用户已删除");
  } catch (error) {
    console.error("删除用户失败:", error);
    throw error;
  }
}

// ========================================
// 在 React 组件中使用示例
// ========================================

/**
 * React Hook 示例：使用用户列表
 */
export function useUsers() {
  // 这里可以使用 Zustand 或 React Query 等状态管理工具
  // 示例代码：
  /*
  const [users, setUsers] = useState<api.User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading };
  */
}
