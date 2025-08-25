import {
  pgTable,
  text,
  boolean,
  timestamp,
  real,
  serial,
  integer,
  bigint,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const instruments = pgTable("instruments", {
  symbol: text("symbol").primaryKey(),
  instrumentType: text("instrument_type").notNull(),
  currency: text("currency").notNull(),
  timezone: text("timezone").notNull(),
  exchangeTimezoneName: text("exchange_timezone_name").notNull(),
  longName: text("long_name"),
  shortName: text("short_name"),
  exchangeName: text("exchange_name").notNull(),
  fullExchangeName: text("full_exchange_name"),
  firstTradeDate: timestamp("first_trade_date"),
  hasPrePostMarketData: boolean("has_pre_post_market_data").default(false),
  chartPreviousClose: real("chart_previous_close"),
  regularMarketPrice: real("regular_market_price").notNull(),
  regularMarketDayHigh: real("regular_market_day_high"),
  regularMarketDayLow: real("regular_market_day_low"),
  regularMarketVolume: real("regular_market_volume"),
  fiftyTwoWeekHigh: real("fifty_two_week_high"),
  fiftyTwoWeekLow: real("fifty_two_week_low"),
  preMarketStart: timestamp("pre_market_start"),
  preMarketEnd: timestamp("pre_market_end"),
  regularMarketStart: timestamp("regular_market_start"),
  regularMarketEnd: timestamp("regular_market_end"),
  postMarketStart: timestamp("post_market_start"),
  postMarketEnd: timestamp("post_market_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Instrument = typeof instruments.$inferSelect;
export type NewInstrument = typeof instruments.$inferInsert;

export const stockPricesDaily = pgTable(
  "stock_prices_daily",
  {
    id: serial("id").primaryKey(),
    symbol: text("symbol").references(() => instruments.symbol),
    date: timestamp("date").notNull(),
    high: real("high"),
    volume: bigint("volume", { mode: "number" }),
    open: real("open"),
    low: real("low"),
    close: real("close"),
    adjclose: real("adj_close"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique().on(table.symbol, table.date)]
);

export type NewStockPricesDaily = typeof stockPricesDaily.$inferInsert;
export type StockPricesDaily = typeof stockPricesDaily.$inferSelect;

export const stockPricesWeekly = pgTable(
  "stock_prices_weekly",
  {
    id: serial("id").primaryKey(),
    symbol: text("symbol").references(() => instruments.symbol),
    date: timestamp("date").notNull(),
    high: real("high"),
    volume: bigint("volume", { mode: "number" }),
    open: real("open"),
    low: real("low"),
    close: real("close"),
    adjclose: real("adj_close"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique().on(table.symbol, table.date)]
);

export type NewStockPricesWeekly = typeof stockPricesWeekly.$inferInsert;
export type StockPricesWeekly = typeof stockPricesWeekly.$inferSelect;

export const stockPricesMonthly = pgTable(
  "stock_prices_monthly",
  {
    id: serial("id").primaryKey(),
    symbol: text("symbol").references(() => instruments.symbol),
    date: timestamp("date").notNull(),
    high: real("high"),
    volume: bigint("volume", { mode: "number" }),
    open: real("open"),
    low: real("low"),
    close: real("close"),
    adjclose: real("adj_close"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique().on(table.symbol, table.date)]
);

export type NewStockPricesMonthly = typeof stockPricesMonthly.$inferInsert;
export type StockPricesMonthly = typeof stockPricesMonthly.$inferSelect;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: text("email").unique().notNull(),
  hashedPassword: text("hashed_password")
    .notNull()
    .default("unset"),
});

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const refreshTokens = pgTable("refresh_tokens", {
  token: text("token").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
});

export type NewRefreshToken = typeof refreshTokens.$inferInsert;
export type RefreshToken = typeof refreshTokens.$inferSelect;

export const fortunes = pgTable("fortunes", {
  id: uuid("id").primaryKey().defaultRandom(),
  symbol: text("symbol").notNull(),
  body: text("body").notNull(),
  stockData: text("stock_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type NewFortune = typeof fortunes.$inferInsert;
export type Fortune = typeof fortunes.$inferSelect;