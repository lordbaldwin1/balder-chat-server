import yahooFinance from "yahoo-finance2";
import { getSymbols } from "../db/queries/instruments";
import { createStockPriceDaily } from "../db/queries/daily-prices";
import { createStockPriceWeekly } from "../db/queries/weekly-prices";
import { createStockPriceMonthly } from "../db/queries/monthly-prices";


export async function gatherPastYearStockPricesDailyWeeklyMonthly() {
  try {
    console.log("Starting the gathering...");
    await getDailyStockPricesPastYear();
    await getWeeklyStockPricesPastYear();
    await getMonthlyStockPricesPastYear();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
      return;
    }
    console.error("LOL! UNKNOWN ERROR OCCURRED!");
    return;
  }
}

async function getDailyStockPricesPastYear() {
  const symbols = await getSymbols();

  if (symbols.length === 0) {
    console.error("OH CRAP, HUH? NO SYMBOLS FOUND, WHAT DO YOU MEAN?");
    return;
  }

  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  for (const symbol of symbols) {
    const data = await yahooFinance.chart(symbol.symbol, {
      period1: oneYearAgo,
      period2: now,
      interval: "1d",
      events: "div|split|earn",
    });

    const quotes = data.quotes;
    for (const quote of quotes) {
      const savedSymbol = await createStockPriceDaily({
        symbol: symbol.symbol,
        date: quote.date,
        high: quote.high,
        volume: quote.volume,
        open: quote.open,
        low: quote.low,
        close: quote.close,
        adjclose: quote.adjclose,
      });
      console.log(`${savedSymbol?.symbol}: ${savedSymbol?.date} saved`);
    }
  }
}

async function getWeeklyStockPricesPastYear() {
  const symbols = await getSymbols();

  if (symbols.length === 0) {
    console.error("OH CRAP, HUH? NO SYMBOLS FOUND, WHAT DO YOU MEAN?");
    return;
  }

  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  for (const symbol of symbols) {
    const data = await yahooFinance.chart(symbol.symbol, {
      period1: oneYearAgo,
      period2: now,
      interval: "1wk",
      events: "div|split|earn",
    });

    const quotes = data.quotes;
    for (const quote of quotes) {
      const savedSymbol = await createStockPriceWeekly({
        symbol: symbol.symbol,
        date: quote.date,
        high: quote.high,
        volume: quote.volume,
        open: quote.open,
        low: quote.low,
        close: quote.close,
        adjclose: quote.adjclose,
      });
      console.log(`${savedSymbol?.symbol}: ${savedSymbol?.date} saved`);
    }
  }
}

async function getMonthlyStockPricesPastYear() {
  const symbols = await getSymbols();

  if (symbols.length === 0) {
    console.error("OH CRAP, HUH? NO SYMBOLS FOUND, WHAT DO YOU MEAN?");
    return;
  }

  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  for (const symbol of symbols) {
    const data = await yahooFinance.chart(symbol.symbol, {
      period1: oneYearAgo,
      period2: now,
      interval: "1mo",
      events: "div|split|earn",
    });

    const quotes = data.quotes;
    for (const quote of quotes) {
      const savedSymbol = await createStockPriceMonthly({
        symbol: symbol.symbol,
        date: quote.date,
        high: quote.high,
        volume: quote.volume,
        open: quote.open,
        low: quote.low,
        close: quote.close,
        adjclose: quote.adjclose,
      });
      console.log(`${savedSymbol?.symbol}: ${savedSymbol?.date} saved`);
    }
  }
}
