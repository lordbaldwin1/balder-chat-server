import express, { json } from "express";
import { config, wsMessageSchema, wsServerState, type wsMessage } from "./config";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
} from "./api/middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handlerGetUser, handlerUsersCreate } from "./api/users";
import type { ServerWebSocket } from "bun";
import * as cookie from "cookie";
import http from "http";
import { WebSocketServer } from "ws";
import { selectUserByID } from "./db/queries/queries";
import { z } from "zod";

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

app.use(middlewareErrorHandler);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/chat" });

wss.on("connection", async (ws, req) => {
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

  ws.on("message", (data) => {
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
    handleMessage(msg);
  });

  ws.on("close", () => {
    console.log("a client disconnected");
  });
});

export function handleMessage(msg: wsMessage) {
  switch (msg.type) {
    case "chat":
      console.log("chat message received:", msg);
      break;
    case "join":
      console.log("join message received:", msg);
      break;
    case "leave":
      console.log("leave message received:", msg);
      break;
  }
}

server.listen(config.port, async () => {
  console.log(`Server listening on ${config.baseURL}:${config.port}`);
});
