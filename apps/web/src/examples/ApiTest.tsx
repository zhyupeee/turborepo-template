import { useState } from "react";
import { api } from "@repo/api";
import { createConnection } from "../lib/connection";

interface TestResult {
  success: boolean;
  message: string;
  data?: unknown;
  error?: unknown;
}

/**
 * 安全的 JSON 字符串化，避免循环引用
 */
const safeJsonStringify = (value: unknown, indent = 2): string => {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (_key: string | number, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    },
    indent,
  );
};

/**
 * API 测试组件
 * 用于测试 Nestia 生成的 SDK 是否能正常调用后端接口
 */
export function ApiTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  /**
   * 测试 1: 获取所有用户
   */
  const testFindAll = async () => {
    try {
      const connection = createConnection();
      const users = await api.users.findAll(connection);
      addResult({
        success: true,
        message: "成功获取用户列表",
        data: users,
      });
      return users;
    } catch (error) {
      addResult({
        success: false,
        message: "获取用户列表失败",
        error,
      });
      throw error;
    }
  };

  /**
   * 测试 2: 创建新用户
   */
  const testCreate = async () => {
    try {
      const connection = createConnection();
      const newUser = {
        email: `test_${Date.now()}@example.com`,
        username: `testuser_${Date.now()}`,
        password: "password123",
        avatar: "https://example.com/avatar.png",
      };
      const created = await api.users.create(connection, newUser);
      addResult({
        success: true,
        message: "成功创建用户",
        data: created,
      });
      return created;
    } catch (error) {
      addResult({
        success: false,
        message: "创建用户失败",
        error,
      });
      throw error;
    }
  };

  /**
   * 测试 3: 获取单个用户
   */
  const testFindOne = async (userId: string) => {
    try {
      const connection = createConnection();
      const user = await api.users.findOne(connection, userId);
      addResult({
        success: true,
        message: `成功获取用户 ${userId}`,
        data: user,
      });
      return user;
    } catch (error) {
      addResult({
        success: false,
        message: `获取用户 ${userId} 失败`,
        error,
      });
      throw error;
    }
  };

  /**
   * 测试 4: 更新用户
   */
  const testUpdate = async (userId: string) => {
    try {
      const connection = createConnection();
      const updateData = {
        username: `updated_user_${Date.now()}`,
        isActive: true,
      };
      const updated = await api.users.update(connection, userId, updateData);
      addResult({
        success: true,
        message: `成功更新用户 ${userId}`,
        data: updated,
      });
      return updated;
    } catch (error) {
      addResult({
        success: false,
        message: `更新用户 ${userId} 失败`,
        error,
      });
      throw error;
    }
  };

  /**
   * 测试 5: 删除用户
   */
  const testRemove = async (userId: string) => {
    try {
      const connection = createConnection();
      await api.users.remove(connection, userId);
      addResult({
        success: true,
        message: `成功删除用户 ${userId}`,
      });
    } catch (error) {
      addResult({
        success: false,
        message: `删除用户 ${userId} 失败`,
        error,
      });
      throw error;
    }
  };

  /**
   * 运行完整测试流程
   */
  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    try {
      // 测试 1: 获取所有用户
      addResult({
        success: true,
        message: "开始测试：获取所有用户",
      });
      await testFindAll();

      // 测试 2: 创建新用户
      addResult({
        success: true,
        message: "开始测试：创建新用户",
      });
      const created = await testCreate();

      // 测试 3: 获取刚创建的用户
      if (created && (created as any).id) {
        const userId = (created as any).id;

        addResult({
          success: true,
          message: "开始测试：获取单个用户",
        });
        await testFindOne(userId);

        // 测试 4: 更新用户
        addResult({
          success: true,
          message: "开始测试：更新用户",
        });
        await testUpdate(userId);

        // 测试 5: 删除用户
        addResult({
          success: true,
          message: "开始测试：删除用户",
        });
        await testRemove(userId);
      }

      addResult({
        success: true,
        message: "🎉 所有测试完成！",
      });
    } catch (error) {
      addResult({
        success: false,
        message: "测试过程中断",
        error,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Nestia API 测试
          </h1>
          <p className="mb-4 text-gray-600">
            测试前后端项目是否能成功连接和通信
          </p>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={`rounded-lg px-6 py-3 font-medium text-white transition-colors ${
              isRunning
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRunning ? "测试中..." : "运行完整测试"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              测试结果
            </h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`rounded border-l-4 p-4 ${
                    result.success
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">
                      {result.message}
                    </p>
                    <span
                      className={`text-sm ${
                        result.success ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.success ? "✓" : "✗"}
                    </span>
                  </div>
                  {!!result.data && (
                    <pre className="mt-2 max-h-48 overflow-auto text-xs text-gray-700">
                      {safeJsonStringify(result.data, 2)}
                    </pre>
                  )}
                  {!!result.error && (
                    <pre className="mt-2 max-h-48 overflow-auto text-xs text-red-700">
                      {safeJsonStringify(result.error, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">测试说明</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>确保后端服务已在 http://localhost:3001 启动</li>
            <li>确保数据库连接正常</li>
            <li>测试流程：查询 → 创建 → 查询单个 → 更新 → 删除</li>
            <li>所有测试结果会显示在下方</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
