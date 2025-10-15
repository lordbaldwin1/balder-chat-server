import type { ServerWebSocket } from "bun";
import type WebSocket from "ws";
import z from "zod";

type Config = {
  baseURL: string;
  port: string;
  platform: string;
  dbURL: string;
  jwtDefaultDuration: number;
  jwtSecret: string;
  clientURL: string;
}

export const config: Config = {
  baseURL: envOrThrow("BASE_URL"),
  port: envOrThrow("PORT"),
  platform: envOrThrow("PLATFORM"),
  dbURL: envOrThrow("DATABASE_URL"),
  jwtDefaultDuration: 60*60,
  jwtSecret: envOrThrow("JWT_SECRET"),
  clientURL: envOrThrow("CLIENT_URL"),
}

function envOrThrow(key: string) {
  const val = process.env[key];
  if (!val) {
    throw new Error(`${key} must be defined in .env`);
  }
  return val;
}

export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
export const FIFTEEN_MINUTES = 15 * 60 * 1000;

type Connection = {
  socket: WebSocket;
  userID: string;
  username: string;
}

type wssState = {
  connections: Record<string, Connection>; // userID -> socket
  rooms: Record<string, Set<string>>; // roomID -> set of userIDs
}

export const wsServerState: wssState = {
  connections: {},
  rooms: {},
}

export const wsMessageSchema = z.object({
  userID: z.string(),
  username: z.string(),
  roomID: z.string(),
  content: z.string(),
  timestamp: z.coerce.date(),
});
export type wsMessage = z.infer<typeof wsMessageSchema>;