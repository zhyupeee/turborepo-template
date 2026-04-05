import type { IConnection } from "@nestia/fetcher";

const HOST = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export const createConnection = (token?: string): IConnection => ({
  host: HOST,
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
});

export const getConnection = (): IConnection => {
  const token = localStorage.getItem("token");
  return createConnection(token || undefined);
};
