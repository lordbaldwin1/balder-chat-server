import { db } from "..";
import { instruments, type NewInstrument } from "../schema";


export async function createInstrument(newInstrument: NewInstrument) {
  const [res] = await db
    .insert(instruments)
    .values(newInstrument)
    .returning();
  return res;
}