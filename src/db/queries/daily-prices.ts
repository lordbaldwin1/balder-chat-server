import { desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { stockPricesDaily, type NewStockPricesDaily } from "../schema";


export async function createStockPriceDaily(newStockPriceDaily: NewStockPricesDaily) {
  const [res] = await db
    .insert(stockPricesDaily)
    .values(newStockPriceDaily)
    .onConflictDoUpdate({
      target: [stockPricesDaily.symbol, stockPricesDaily.date],
      set: {
        open: sql`EXCLUDED.open`,
        high: sql`EXCLUDED.high`,
        low: sql`EXCLUDED.low`,
        close: sql`EXCLUDED.close`,
        adjclose: sql`EXCLUDED.adj_close`,
        volume: sql`EXCLUDED.volume`,
      },
    })
    .returning({ symbol: stockPricesDaily.symbol, date: stockPricesDaily.date });
  return res;
}

export async function getStockPricesDaily(symbol: string) {
  const rows = await db
    .select()
    .from(stockPricesDaily)
    .where(eq(stockPricesDaily.symbol, symbol))
    .orderBy(desc(stockPricesDaily.date));
  return rows;
}