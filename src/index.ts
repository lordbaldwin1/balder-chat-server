import express, { json } from "express";
import {
  config,
  wsMessageSchema,
  wsServerState,
  type wsMessage,
} from "./config";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
} from "./api/middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handlerGetUser, handlerUsersCreate } from "./api/users";
import * as cookie from "cookie";
import http from "http";
import { WebSocketServer } from "ws";
import {
  insertMessage,
  selectRooms,
  selectUserByID,
} from "./db/queries/queries";
import { z } from "zod";
import {
  handlerRoomGetMessages,
  handlerRoomsCreate,
  handlerRoomsGet,
} from "./api/rooms";
import type { NewMessage } from "./db/schema";

const app = express();

app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.clientURL,
    credentials: true,
  })
);
app.use(middlewareLogResponses);

app.post("/api/users/create", (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res).catch(next));
});
app.get("/api/users", (req, res, next) => {
  Promise.resolve(handlerGetUser(req, res).catch(next));
});
app.post("/api/rooms/create", (req, res, next) => {
  Promise.resolve(handlerRoomsCreate(req, res).catch(next));
});
app.get("/api/rooms", (req, res, next) => {
  Promise.resolve(handlerRoomsGet(req, res).catch(next));
});
app.get("/api/messages/:roomID", (req, res, next) => {
  Promise.resolve(handlerRoomGetMessages(req, res).catch(next));
});

app.use(middlewareErrorHandler);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/chat" });

wss.on("connection", async (ws, req) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const roomID = url.searchParams.get("roomID");

  if (!roomID) {
    ws.close();
    return;
  }

  const cookies = cookie.parse(req.headers.cookie || "");
  const userID = cookies.accessToken;

  if (!userID) {
    ws.close();
    return;
  }

  const user = await selectUserByID(userID);
  if (!user) {
    ws.close();
    return;
  }

  wsServerState.connections[user.id] = {
    socket: ws,
    userID: user.id,
    username: user.username,
  };

  if (!wsServerState.rooms[roomID]) {
    ws.close();
    return;
  }
  wsServerState.rooms[roomID].add(user.id);

  ws.on("message", async (data) => {
    let parsed: unknown;

    try {
      parsed = JSON.parse(data.toString());
    } catch {
      ws.send(JSON.stringify({ error: "invalid json" }));
      return;
    }

    const res = wsMessageSchema.safeParse(parsed);
    if (!res.success) {
      console.warn("invalid message shape:", z.treeifyError(res.error));
      ws.send(JSON.stringify({ error: "invalid message" }));
      return;
    }

    const msg = res.data;
    await handleMessage(msg);
  });

  ws.on("close", () => {
    for (const roomID in wsServerState.rooms) {
      wsServerState.rooms[roomID]?.delete(user.id);
    }

    delete wsServerState.connections[user.id];
  });
});

export async function handleMessage(msg: wsMessage) {
  if (!wsServerState.rooms[msg.roomID]) {
    return;
  }

  const users = wsServerState.rooms[msg.roomID];
  if (!users) {
    return;
  }

  for (const userID of users) {
    const connection = wsServerState.connections[userID];
    if (!connection) {
      continue;
    }
    connection.socket.send(JSON.stringify(msg));
  }

  const res = await insertMessage({
    content: msg.content,
    createdAt: msg.timestamp,
    userId: msg.userID,
    roomId: msg.roomID,
  } satisfies NewMessage);

  if (!res) {
    console.log(`[MSG FAILED] ${msg.userID} sent to ${msg.roomID}`);
    return;
  }
  console.log(`[MSG SAVED] user: ${res.userId} sent to room: ${res.roomId}`);
}

server.listen(config.port, async () => {
  console.log("Setting up server state.");
  const rooms = await selectRooms();

  if (rooms.length === 0) {
    console.log("no rooms to set up");
  } else {
    for (const room of rooms) {
      wsServerState.rooms[room.id] = new Set<string>();
    }
    console.log("rooms setup");
  }

  console.log(`Server listening on ${config.baseURL}:${config.port}`);
});
