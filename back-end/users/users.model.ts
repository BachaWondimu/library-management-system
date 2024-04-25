import { InferSchemaType, Schema, model } from "mongoose";
import { user_book_schema } from "../inventories/inventories.schema";

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  balance: { type: Number },
  inventories: { type: [user_book_schema], default: [] },
  role: { type: String, enum: ["LIBRARIAN", "USER"], default: "USER" },
});

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model<User>("user", userSchema);
