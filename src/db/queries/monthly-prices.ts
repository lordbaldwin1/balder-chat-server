import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { stockPricesMonthly, type NewStockPricesMonthly } from "../schema";


export async function createStockPriceMonthly(newStockPriceMonthly: NewStockPricesMonthly) {
  const [res] = await db
    .insert(stockPricesMonthly)
    .values(newStockPriceMonthly)
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