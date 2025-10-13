import type { Request, Response } from "express";
import { insertRoom, selectRooms } from "../db/queries/queries";
import type { NewRoom } from "../db/schema";


export async function handlerRoomsCreate(req: Request, res: Response) {
    type Parameters = {
        room: string;
    }

    const params: Parameters = req.body;
    const userID = req.cookies.accessToken;

    const createdRoom = await insertRoom({
        name: params.room,
        ownerId: userID,
    } satisfies NewRoom);
    console.log("room created:", createdRoom);
    res.status(201).send(createdRoom);
}

export async function handlerRoomsGet(_: Request, res: Response) {
    const rooms = await selectRooms();
    if (rooms.length == 0) {
        return [];
    }
    res.status(200).send(rooms);
}