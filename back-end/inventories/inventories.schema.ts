import { InferSchemaType, Schema } from "mongoose";

export const user_book_schema = new Schema({
  isbn: { type: String, required: true },
  copy_id: { type: String, required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
});

export type UserBook = InferSchemaType<typeof user_book_schema>;
