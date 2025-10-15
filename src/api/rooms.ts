import type { Request, Response } from "express";
import {
  insertRoom,
  selectMessagesWithUsernamesByRoomID,
  selectRooms,
} from "../db/queries/queries";
import type { NewRoom } from "../db/schema";
import { wsServerState } from "../config";
import { BadRequestError } from "./errors";

export async function handlerRoomsCreate(req: Request, res: Response) {
  type Parameters = {
    room: string;
  };

  const params: Parameters = req.body;
  const userID = req.cookies.accessToken;

  const createdRoom = await insertRoom({
    name: params.room,
    ownerId: userID,
  } satisfies NewRoom);

  if (!createdRoom) {
    throw new Error("Failed to create room");
  }

  wsServerState.rooms[createdRoom.id] = new Set<string>();
  res.status(201).send(createdRoom);
}

export async function handlerRoomsGet(_: Request, res: Response) {
  const rooms = await selectRooms();
  if (rooms.length == 0) {
    return [];
  }
  res.status(200).send(rooms);
}

export async function handlerRoomGetMessages(req: Request, res: Response) {
  const roomID = req.params.roomID;
  if (!roomID) {
    throw new BadRequestError("Missing roomID");
  }

  const messages = await selectMessagesWithUsernamesByRoomID(roomID);

  res.status(200).send(messages);
}
