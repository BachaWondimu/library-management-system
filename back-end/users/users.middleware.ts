import { RequestHandler } from "express";
import { ErrorWithStatus, Token } from "../helpers/types";
import { verify } from "jsonwebtoken";

export const validateUser: RequestHandler = async (req, res, nex) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new ErrorWithStatus("Authorization header is required", 400);
    }
    const jwt = authorization.split(" ")[1];
    if (!jwt) {
      throw new ErrorWithStatus("Token is required", 400);
    }
    if (!process.env.PRIVATE_KEY) {
      throw new ErrorWithStatus("Private key is missing", 500);
    }
    const token = verify(jwt, process.env.PRIVATE_KEY) as Token;
    req.token = token;
    nex();
  } catch (error) {
    nex(error);
  }
};
