import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { stockPricesDaily, type NewStockPricesDaily } from "../schema";


export async function createStockPriceDaily(newStockPriceDaily: NewStockPricesDaily) {
  const [res] = await db
    .insert(stockPricesDaily)
    .values(newStockPriceDaily)
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