import yahooFinance from "yahoo-finance2";
import { createInstrument } from "../db/queries/instruments";
import { instruments } from "./instrument-data";

interface ExtendedMeta {
  symbol: string;
  instrumentType: string;
  currency: string;
  timezone: string;
  exchangeTimezoneName: string;
  longName?: string;
  shortName?: string;
  exchangeName: string;
  fullExchangeName?: string;
  firstTradeDate: Date | null;
  hasPrePostMarketData?: boolean;
  chartPreviousClose?: number;
  regularMarketPrice: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  currentTradingPeriod: {
    pre: { start: Date; end: Date };
    regular: { start: Date; end: Date };
    post: { start: Date; end: Date };
  };
}

async function seedInstruments() {
  for (const instrument of instruments) {
    const data = await yahooFinance.chart(instrument, {
      period1: "2024-01-01",
      period2: "2024-01-07",
      events: "div|split|earn",
    });
    const meta = data.meta as ExtendedMeta;
    const newInstrument = await createInstrument({
      symbol: meta.symbol,
      instrumentType: meta.instrumentType,
      currency: meta.currency,
      timezone: meta.timezone,
      exchangeTimezoneName: meta.exchangeTimezoneName,
      longName: meta.longName,
      shortName: meta.shortName,
      exchangeName: meta.exchangeName,
      fullExchangeName: meta.fullExchangeName,
      firstTradeDate: meta.firstTradeDate,
      hasPrePostMarketData: meta.hasPrePostMarketData,
      chartPreviousClose: meta.chartPreviousClose,
      regularMarketPrice: meta.regularMarketPrice,
      regularMarketDayHigh: meta.regularMarketDayHigh,
      regularMarketDayLow: meta.regularMarketDayLow,
      regularMarketVolume: meta.regularMarketVolume,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
      preMarketStart: meta.currentTradingPeriod.pre.start,
      preMarketEnd: meta.currentTradingPeriod.pre.end,
      regularMarketStart: meta.currentTradingPeriod.regular.start,
      regularMarketEnd: meta.currentTradingPeriod.regular.end,
      postMarketStart: meta.currentTradingPeriod.post.start,
      postMarketEnd: meta.currentTradingPeriod.post.end,
    });
    console.log(`${newInstrument?.symbol} saved`);
  }
}

await seedInstruments();
