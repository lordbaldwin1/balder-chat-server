import express, { json } from "express";
import { config } from "./config";
import { middlewareErrorHandler } from "./middleware";

const app = express();

app.use(json());


app.use(middlewareErrorHandler);

const server = app.listen(config.port, () => {
  console.log(`Server listening on ${config.baseURL}${config.port}`);
})