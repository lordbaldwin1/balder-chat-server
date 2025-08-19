import { eq } from "drizzle-orm";
import { db } from "..";
import { instruments, type NewInstrument } from "../schema";

export async function createInstrument(newInstrument: NewInstrument) {
  const [res] = await db.insert(instruments).values(newInstrument).onConflictDoUpdate({
    target: [instruments.symbol],
    set: newInstrument,
  }).returning();
  return res;
}

export async function getSymbols() {
  const rows = await db
    .select({
      symbol: instruments.symbol,
    })
    .from(instruments);
  return rows;
}

export async function getInstrument(symbol: string) {
  const [res] = await db
    .select()
    .from(instruments)
    .where(eq(instruments.symbol, symbol));
  return res;
}