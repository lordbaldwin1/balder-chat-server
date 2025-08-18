import express, { json } from "express";
import { config } from "./config";
import { middlewareErrorHandler } from "./middleware";
import { gatherPastYearStockPricesDailyWeeklyMonthly } from "./data/quotes";

const app = express();

app.use(json());


app.use(middlewareErrorHandler);

const server = app.listen(config.port, async () => {
  console.log(`Server listening on ${config.baseURL}${config.port}`);
  await gatherPastYearStockPricesDailyWeeklyMonthly();
});