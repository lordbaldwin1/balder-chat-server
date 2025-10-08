import express, { json } from "express";
import { config } from "./config";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
} from "./api/middleware";
import cors from "cors";

const app = express();

app.use(json());
app.use(
  cors({
    origin: config.clientURL,
    credentials: true,
  })
);
app.use(middlewareLogResponses);

// app.post("/api/users/create", (req, res, next) => {
//   Promise.resolve(handlerUsersCreate(req, res).catch(next));
// });

app.use(middlewareErrorHandler);

const server = app.listen(config.port, async () => {
  console.log(`Server listening on ${config.baseURL}:${config.port}`);
});
