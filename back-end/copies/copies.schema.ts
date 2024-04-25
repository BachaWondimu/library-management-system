import { InferSchemaType, Schema } from "mongoose";

export const bookcopySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["Borrowed", "Returned"],
      required: true,
      default: "Returned",
    },
  },
  { versionKey: false }
);

export type BookCopy = InferSchemaType<typeof bookcopySchema>;
