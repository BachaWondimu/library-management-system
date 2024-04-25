import { InferSchemaType, Schema, model } from "mongoose";
import { bookcopySchema } from "../copies/copies.schema";

const bookSchema = new Schema(
  {
    isbn: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    copies: { type: [bookcopySchema], default: [] },
    price: { type: Number, required: true, default: 100 },
    added_by: {
      user_id: String,
      fullname: String,
      email: String,
    },
  },
  { versionKey: false }
);

export type Book = InferSchemaType<typeof bookSchema>;
export const BookModel = model<Book>("book", bookSchema);
