import express, { json } from "express";
import { config } from "./config";
import { middlewareErrorHandler } from "./api/middleware";
import cron from "node-cron";
import { gatherStockDataDaily } from "./data/cron";
import { globalStockState, initGlobalStockState } from "./state";

const app = express();

app.use(json());

app.use(middlewareErrorHandler);

cron.schedule("45 13 * * *", async () => {
  console.log("Starting daily stock data gathering");
  await gatherStockDataDaily();
  console.log("Daily stock data gathered!")
  await initGlobalStockState(globalStockState);
  console.log("Global stock state updated")
});

const server = app.listen(config.port, async () => {
  console.log(`Server listening on ${config.baseURL}${config.port}`);

  console.log("Initializing stock state");
  await initGlobalStockState(globalStockState);
  console.log("Stock state initialized, fortunes are ready to be told.");
});
