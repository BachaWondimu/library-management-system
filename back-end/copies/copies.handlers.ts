import { RequestHandler } from "express";
import { ErrorWithStatus, StandardResponse } from "../helpers/types";
import { BookCopy } from "./copies.schema";
import { BookModel } from "../books/books.model";
import { Types } from "mongoose";

export const get_copies_handler: RequestHandler<
  { isbn: string },
  StandardResponse<BookCopy[]>,
  unknown,
  { page: number }
> = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    if (!isbn) {
      throw new ErrorWithStatus("Book isbn is required", 401);
    }
    //TODO: Implement pagination
    const book = await BookModel.findOne({ isbn }, { _id: 0, copies: 1 });
    if (!book || book.copies.length === 0) {
      throw new ErrorWithStatus("Copies not found", 401);
    }
    res.status(200).json({ success: true, data: book.copies });
  } catch (error) {
    next(error);
  }
};
export const post_copy_handler: RequestHandler<
  { isbn: string },
  StandardResponse<string>,
  BookCopy
> = async (req, res, next) => {
  try {
    const { _id: user_id, role } = req.token;
    if (role !== "LIBRARIAN") {
      throw new ErrorWithStatus("Only librarians can add copies", 401);
    }
    const isbn = req.params.isbn;
    if (!isbn) {
      throw new ErrorWithStatus("Book ID is required", 401);
    }
    const copy = req.body;
    const copy_id = new Types.ObjectId();
    const book = await BookModel.updateOne(
      { isbn },
      {
        $push: {
          copies: {
            ...copy,
            _id: copy_id,
          },
        },
      }
    );
    if (!book || book.modifiedCount === 0) {
      throw new ErrorWithStatus("Book not found", 401);
    }
    res.status(201).json({ success: true, data: copy_id.toString() });
  } catch (error) {
    next(error);
  }
};
export const get_copy_by_id_handler: RequestHandler<
  { isbn: string; copy_id: string },
  StandardResponse<BookCopy>
> = async (req, res, next) => {
  try {
    const { isbn, copy_id } = req.params;
    if (!isbn) {
      throw new ErrorWithStatus("Book isbn is required", 401);
    }
    if (!copy_id) {
      throw new ErrorWithStatus("Copy ID is required", 401);
    }
    const book = await BookModel.findOne(
      { isbn, "copies._id": copy_id },
      { _id: 0, "copies.$": 1 }
    );
    if (!book || book.copies.length === 0) {
      throw new ErrorWithStatus("Copy not found", 401);
    }
    res.status(200).json({ success: true, data: book.copies[0] });
  } catch (error) {
    next(error);
  }
};
export const put_copy_by_id_handler: RequestHandler<
  { isbn: string; copy_id: string },
  StandardResponse<number>,
  BookCopy
> = async (req, res, next) => {
  try {
    const { isbn, copy_id } = req.params;
    if (!isbn) {
      throw new ErrorWithStatus("Book isbn is required", 401);
    }
    if (!copy_id) {
      throw new ErrorWithStatus("Copy ID is required", 401);
    }
    const updated_copy = req.body;
    const book = await BookModel.updateOne(
      { isbn, "copies._id": copy_id },
      {
        $set: {
          "copies.$": {
            ...updated_copy,
            _id: copy_id,
          },
        },
      }
    );
    if (!book || book.modifiedCount === 0) {
      throw new ErrorWithStatus("Copy not found", 401);
    }
    res.status(200).json({ success: true, data: book.modifiedCount });
  } catch (error) {
    next(error);
  }
};
export const delete_copy_by_id_handler: RequestHandler<
  { isbn: string; copy_id: string },
  StandardResponse<number>
> = async (req, res, next) => {
  try {
    const { isbn, copy_id } = req.params;
    if (!isbn) {
      throw new ErrorWithStatus("Book isbn is required", 401);
    }
    if (!copy_id) {
      throw new ErrorWithStatus("Copy ID is required", 401);
    }
    const book = await BookModel.updateOne(
      { isbn },
      {
        $pull: {
          copies: {
            _id: copy_id,
          },
        },
      }
    );
    if (!book || book.modifiedCount === 0) {
      throw new ErrorWithStatus("Copy not found", 401);
    }
    res.status(200).json({ success: true, data: book.modifiedCount });
  } catch (error) {
    next(error);
  }
};
