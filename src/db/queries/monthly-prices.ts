import { desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { stockPricesMonthly, type NewStockPricesMonthly } from "../schema";


export async function createStockPriceMonthly(newStockPriceMonthly: NewStockPricesMonthly) {
  const [res] = await db
    .insert(stockPricesMonthly)
    .values(newStockPriceMonthly)
    .onConflictDoUpdate({
      target: [stockPricesMonthly.symbol, stockPricesMonthly.date],
      set: {
        open: sql`EXCLUDED.open`,
        high: sql`EXCLUDED.high`,
        low: sql`EXCLUDED.low`,
        close: sql`EXCLUDED.close`,
        adjclose: sql`EXCLUDED.adj_close`,
        volume: sql`EXCLUDED.volume`,
      },
    })
    .returning({ symbol: stockPricesMonthly.symbol, date: stockPricesMonthly.date });
  return res;
}

export async function getStockPricesMonthly(symbol: string) {
  const rows = await db
    .select()
    .from(stockPricesMonthly)
    .where(eq(stockPricesMonthly.symbol, symbol))
    .orderBy(desc(stockPricesMonthly.date));
  return rows;
}