import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { stockPricesWeekly, type NewStockPricesWeekly } from "../schema";


export async function createStockPriceWeekly(newStockPriceWeekly: NewStockPricesWeekly) {
  const [res] = await db
    .insert(stockPricesWeekly)
    .values(newStockPriceWeekly)
    .returning({ symbol: stockPricesWeekly.symbol, date: stockPricesWeekly.date });
  return res;
}

export async function getStockPricesWeekly(symbol: string) {
  const rows = await db
    .select()
    .from(stockPricesWeekly)
    .where(eq(stockPricesWeekly.symbol, symbol))
    .orderBy(desc(stockPricesWeekly.date));
  return rows;
}