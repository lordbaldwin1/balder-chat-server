import { eq } from "drizzle-orm";
import { db } from "..";
import {
  messages,
  rooms,
  users,
  type NewMessage,
  type NewRoom,
  type NewUser,
} from "../schema";

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

export async function selectRooms() {
  const rows = await db.select().from(rooms);
  return rows;
}

export async function insertMessage(message: NewMessage) {
  const [res] = await db.insert(messages).values(message).returning();
  return res;
}

export async function selectMessagesWithUsernamesByRoomID(roomID: string) {
  const rows = await db
    .select({
      content: messages.content,
      createdAt: messages.createdAt,
      userId: messages.userId,
      roomId: messages.roomId,
      username: users.username,
    })
    .from(messages)
    .leftJoin(users, eq(messages.userId, users.id))
    .where(eq(messages.roomId, roomID))
    .orderBy(messages.createdAt);
  return rows;
}
