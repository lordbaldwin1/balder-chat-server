import { db } from "..";
import { instruments, type NewInstrument } from "../schema";

export async function createInstrument(newInstrument: NewInstrument) {
  const [res] = await db.insert(instruments).values(newInstrument).returning();
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
