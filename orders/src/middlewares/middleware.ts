import express from "express";

import { verifyJwtToken } from "../utils/util";

export async function authenticationMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new Error("unauthorized");
    }

    const token = authorizationHeader.split("Bearer ")[1];
    const payload = await verifyJwtToken(token);
    if (!payload) {
      throw new Error("unauthorized");
    }

    req.app.locals.user_id = payload.sub;

    next();
  } catch (e) {
    res.status(401).json({
      error: "unauthorized",
    });
  }
}