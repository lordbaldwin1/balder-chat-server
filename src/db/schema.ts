import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const instruments = pgTable("instruments", {
  id: uuid("id").defaultRandom().primaryKey(),
  symbol: text("symbol").notNull(),
  instrumentType: text("instrument_type").notNull(),
  currency: text("currency").notNull(),
  timezone: text("timezone").notNull(),
  exchangeTimezoneName: text("exchange_timezone_name").notNull(),
  longName: text("long_name"),
  shortName: text("short_name"),
  exchangeName: text("exchange_name").notNull(),
  fullExchangeName: text("full_exchange_name"),
  firstTradeDate: timestamp("first_trade_date"),
  hasPrePostMarketData: boolean("has_pre_post_market_data"),
  preMarketStart: timestamp("pre_market_start"),
  preMarketEnd: timestamp("pre_market_end"),
  regularMarketStart: timestamp("regular_market_start"),
  regularMarketEnd: timestamp("regular_market_end"),
  postMarketStart: timestamp("post_market_start"),
  postMarketEnd: timestamp("post_market_end"),
});

export type NewInstrument = typeof instruments.$inferInsert;
export type Instrument = typeof instruments.$inferSelect;