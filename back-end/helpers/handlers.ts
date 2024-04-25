import { ErrorRequestHandler, RequestHandler } from "express";
import { ErrorWithStatus, StandardResponse } from "./types";

export const noRouteHandler: RequestHandler = async (req, res, next) => {
  next(new ErrorWithStatus("Route not found", 404));
};

export const myErrorHandler: ErrorRequestHandler<
  unknown,
  StandardResponse<string>
> = async (err, req, res, next) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.statusCode).json({ success: false, data: err.message });
  } else if (err instanceof Error) {
    res.status(500).json({ success: false, data: err.message });
  } else {
    res.status(500).json({ success: false, data: "something went wrong!" });
  }
};
