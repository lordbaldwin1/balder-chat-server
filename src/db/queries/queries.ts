import { eq } from "drizzle-orm";
import { db } from "..";
import { users, type NewUser } from "../schema";


export async function insertUserIntoDB(user: NewUser) {
    const [res] = await db.insert(users).values(user).returning();
    return res;
}

export async function selectUserByID(userID: string) {
    const [res] = await db.select().from(users).where(eq(users.id, userID));
    return res;
}