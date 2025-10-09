import express, { json } from "express";
import { config } from "./config";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
} from "./api/middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handlerGetUser, handlerUsersCreate } from "./api/users";

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

const server = app.listen(config.port, async () => {
  console.log(`Server listening on ${config.baseURL}:${config.port}`);
});

const wsServer = Bun.serve({
  port: 8173,
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) { }, // a message is received
    open(ws) { }, // a socket is opened
    close(ws, code, message) { }, // a socket is closed
    drain(ws) { }, // the socket is ready to receive more data
  },
});
