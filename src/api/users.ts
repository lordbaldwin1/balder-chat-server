import type { Request, Response } from "express";
import { insertUser, selectUserByID } from "../db/queries/queries";
import type { NewUser, User } from "../db/schema";
import { config, SEVEN_DAYS } from "../config";
import { NotFoundError } from "./errors";

export async function handlerUsersCreate(_: Request, res: Response) {
    const user = await insertUser({
        username: "anon" + String(Math.floor((Math.random() * 10000))),
    } satisfies NewUser);
    if (!user) {
        throw new Error("Failed to create user, please try again")
    }
    res.cookie("accessToken", user.id, {
        httpOnly: true,
        secure: config.platform === "production",
        sameSite: "strict",
        maxAge: SEVEN_DAYS,
        path: "/",
    });

    res.header("Content-Type", "application/json");
    res.status(201).send(JSON.stringify(user));
};

export async function handlerGetUser(req: Request, res: Response) {
    const token = req.cookies.accessToken;

    if (!token) {
        res.status(200).json(null);
        return;
    }

    const user = await selectUserByID(token);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const body: User = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
    };
    res.status(200).send(JSON.stringify(body));
}

export async function handlerLogout(_: Request, res: Response) {  
    res.clearCookie("accessToken", {
      path: "/",
    })
    res.status(204).send();
  }