import {
  pgTable,
  text,
  boolean,
  timestamp,
  real,
  serial,
  integer,
  bigint,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export type NewRoom = typeof rooms.$inferInsert;
export type Room = typeof rooms.$inferSelect;

export const roomMembers = pgTable("room_members", {
  roomId: uuid("room_id").notNull().references(() => rooms.id),
  userId: uuid("user_id").notNull().references(() => users.id),
});

export type NewRoomMember = typeof roomMembers.$inferInsert;
export type RoomMember = typeof roomMembers.$inferSelect;

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
  roomId: uuid("room_id").notNull().references(() => rooms.id),
});

export type NewMessage = typeof messages.$inferInsert;
export type Message = typeof messages.$inferSelect;