import express, { json } from "express";
import { config } from "./config";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
} from "./api/middleware";
import cron from "node-cron";
import { gatherStockDataDaily } from "./data/cron";
import { globalStockState, initGlobalStockState } from "./state";
import {
  handlerGetUser,
  handlerLogin,
  handlerRefreshJWT,
  handlerRevokeRefreshToken,
  handlerUsersCreate,
} from "./api/users";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handlerGenerateFortune, handlerGetSymbols } from "./api/fortunes";

const app = express();

app.use(json());
app.use(
  cors({
    origin: config.clientURL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(middlewareLogResponses);

app.post("/api/users/create", (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res).catch(next));
});
app.post("/api/users/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res).catch(next));
});
// change endpoint to /api/users/auth?
app.get("/api/users", (req, res, next) => {
  Promise.resolve(handlerGetUser(req, res).catch(next));
});
app.post("/api/users/refresh", (req, res, next) => {
  Promise.resolve(handlerRefreshJWT(req, res).catch(next));
});
app.post("/api/users/logout", (req, res, next) => {
  Promise.resolve(handlerRevokeRefreshToken(req, res).catch(next));
});
app.post("/api/fortunes", (req, res, next) => {
  Promise.resolve(handlerGenerateFortune(req, res).catch(next));
});
app.get("/api/instruments", (req, res, next) => {
  Promise.resolve(handlerGetSymbols(req, res).catch(next));
});

app.use(middlewareErrorHandler);

cron.schedule("45 13 * * *", async () => {
  console.log("Starting daily stock data gathering");
  await gatherStockDataDaily();
  console.log("Daily stock data gathered!");
  await initGlobalStockState(globalStockState);
  console.log("Global stock state updated");
});

const server = app.listen(config.port, async () => {
  console.log(`Server listening on ${config.baseURL}${config.port}`);

  console.log("Initializing stock state");
  await initGlobalStockState(globalStockState);
  console.log("Stock state initialized, fortunes are ready to be told.");
});
