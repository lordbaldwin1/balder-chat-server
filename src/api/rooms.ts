import type { Request, Response } from "express";
import { insertRoom } from "../db/queries/queries";
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

}