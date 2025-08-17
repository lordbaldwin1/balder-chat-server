import yahooFinance from "yahoo-finance2";
import { createInstrument } from "../db/queries/instruments";

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
  currentTradingPeriod: {
    pre: { start: Date; end: Date };
    regular: { start: Date; end: Date };
    post: { start: Date; end: Date };
  };
}

const data = await yahooFinance.chart("AAPL", {
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
  preMarketStart: meta.currentTradingPeriod.pre.start,
  preMarketEnd: meta.currentTradingPeriod.pre.end,
  regularMarketStart: meta.currentTradingPeriod.regular.start,
  regularMarketEnd: meta.currentTradingPeriod.regular.end,
  postMarketStart: meta.currentTradingPeriod.post.start,
  postMarketEnd: meta.currentTradingPeriod.post.end,
});