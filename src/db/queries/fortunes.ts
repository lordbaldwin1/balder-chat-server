import { db } from "..";
import { fortunes, type NewFortune } from "../schema";


export async function saveFortune(fortune: NewFortune) {
  const [res] = await db
    .insert(fortunes)
    .values(fortune)
    .returning();
  return res;
}