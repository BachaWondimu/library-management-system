import { RequestHandler } from "express";
import { ErrorWithStatus, StandardResponse } from "../helpers/types";
import { User, UserModel } from "./users.model";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

export const signin_handler: RequestHandler<
  unknown,
  StandardResponse<{
    token: string;
    user: { fullname: string; _id: string; role: string };
  }>,
  { email: string; password: string },
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ErrorWithStatus("User not found", 401);
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new ErrorWithStatus("Invalid password", 401);
    }
    const { _id, fullname, role } = user;
    if (!process.env.PRIVATE_KEY) {
      throw new ErrorWithStatus("Private key not found", 500);
    }
    const jwt = sign(
      {
        _id,
        fullname,
        email,
        role,
      },
      process.env.PRIVATE_KEY
    );
    res.status(200).json({
      success: true,
      data: { token: jwt, user: { fullname, _id: _id.toString(), role } },
    });
  } catch (error) {
    next(error);
  }
};
export const signup_handler: RequestHandler<
  unknown,
  StandardResponse<boolean>,
  User,
  unknown
> = async (req, res, next) => {
  try {
    const new_user = req.body;
    const hashedPassword = await hash(new_user.password, 10);
    const result = await UserModel.create({
      ...new_user,
      password: hashedPassword,
    });

    res.status(200).json({ success: true, data: true });
  } catch (error) {
    next(error);
  }
};
