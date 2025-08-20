import type { NextFunction, Request, Response } from "express";


export function middlewareErrorHandler(err: Error, _: Request, res: Response, __: NextFunction) {
  res.set("Content-Type", "application/json");
  res.status(500).send({
    error: err.message
  });
  res.end();
}