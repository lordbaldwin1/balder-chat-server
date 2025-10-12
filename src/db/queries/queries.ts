import { eq } from "drizzle-orm";
import { db } from "..";
import { rooms, users, type NewRoom, type NewUser } from "../schema";

export async function insertUser(user: NewUser) {
  const [res] = await db.insert(users).values(user).returning();
  return res;
}

export async function selectUserByID(userID: string) {
  const [res] = await db.select().from(users).where(eq(users.id, userID));
  return res;
}

export async function insertRoom(room: NewRoom) {
  const [res] = await db.insert(rooms).values(room).returning();
  return res;
}
