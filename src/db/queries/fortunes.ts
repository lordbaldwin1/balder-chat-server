import { eq } from "drizzle-orm";
import { db } from "..";
import { fortunes, type NewFortune } from "../schema";


export async function saveFortune(fortune: NewFortune) {
  const [res] = await db
    .insert(fortunes)
    .values(fortune)
    .returning();
  return res;
}

export async function getFortunesByUserID(userID: string) {
  const rows = await db
    .select()
    .from(fortunes)
    .where(eq(fortunes.userId, userID));
  return rows;
}