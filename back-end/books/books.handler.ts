import { RequestHandler } from "express";
import {
  StandardResponse,
  ErrorWithStatus,
  RequestBodyBook,
} from "../helpers/types";

import { Book, BookModel } from "./books.model";

import { BookCopy } from "../copies/copies.schema";
import { UserModel } from "../users/users.model";

export const get_books_handler: RequestHandler<
  unknown,
  StandardResponse<Book[]>,
  unknown,
  { page: number }
> = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const page_size = 10;
    const books = await BookModel.find({})
      .sort({ title: 1 })
      .skip((page - 1) * page_size)
      .limit(page_size);
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

//Note: post need to create copies
export const post_book_handler: RequestHandler<
  unknown,
  StandardResponse<string>,
  RequestBodyBook
> = async (req, res, next) => {
  try {
    const token = req.token;
    if (!token) {
      throw new ErrorWithStatus("Token is required to post a book", 401);
    }
    const { _id: user_id, email, fullname, role } = token;
    if (role !== "LIBRARIAN") {
      throw new ErrorWithStatus("Unauthorized user", 401);
    }

    const book = req.body;
    const { isbn, title, author, number_of_copies } = req.body;
    if (!isbn || !title || !author || number_of_copies < 1) {
      throw new ErrorWithStatus(
        "Book isbn, title and author are required",
        401
      );
    }
    let copies: BookCopy[] = [];

    for (let i = 0; i < number_of_copies; i++) {
      copies.push({ status: "Returned" });
    }

    const new_book = await BookModel.create({
      ...book,
      copies,
      added_by: { user_id, email, fullname },
    });

    res.status(201).json({ success: true, data: new_book._id.toString() });
  } catch (error) {
    next(error);
  }
};
export const get_book_by_isbn_handler: RequestHandler<
  { isbn: string },
  StandardResponse<Book>
> = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    if (!isbn) {
      throw new ErrorWithStatus("Book isbn is required", 401);
    }
    const book = await BookModel.findOne({ isbn });
    if (!book) {
      throw new ErrorWithStatus("Book not found", 401);
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

export const get_book_by_title_handler: RequestHandler<
  { title: string },
  StandardResponse<Book>
> = async (req, res, next) => {
  try {
    const title = req.params.title;
    if (!title) {
      throw new ErrorWithStatus("Title is required", 401);
    }
    const book = await BookModel.findOne({ title });
    if (!book) {
      throw new ErrorWithStatus("Book not found", 401);
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

export const put_book_by_isbn_handler: RequestHandler<
  { isbn: string },
  StandardResponse<number>,
  Book
> = async (req, res, next) => {
  try {
    const token = req.token;
    if (!token) {
      throw new ErrorWithStatus("Token is required to put a book", 401);
    }
    const { _id: user_id, role } = token;
    if (role !== "LIBRARIAN") {
      throw new ErrorWithStatus("Unauthorized user", 401);
    }
    const { isbn } = req.params;
    if (!isbn) {
      throw new ErrorWithStatus("Book isbn is required", 401);
    }
    const book = req.body;
    if (!book) {
      throw new ErrorWithStatus("Book data is required", 401);
    }
    const updated_book = await BookModel.updateOne(
      {
        isbn,
      },

      {
        $set: { copies: book.copies },
      }
    );
    if (updated_book.modifiedCount === 0) {
      throw new ErrorWithStatus("Book not found", 401);
    }
    res.status(200).json({ success: true, data: updated_book.modifiedCount });
  } catch (error) {
    next(error);
  }
};

export const put_book_by_copies_handler: RequestHandler<
  { isbn: string },
  StandardResponse<number>,
  { copies: number }
> = async (req, res, next) => {
  try {
    const token = req.token;
    if (!token) {
      throw new ErrorWithStatus("Token is required to put a book", 401);
    }
    const { _id: user_id, role } = token;
    if (role !== "LIBRARIAN") {
      throw new ErrorWithStatus("Unauthorized user", 401);
    }
    const { isbn } = req.params;
    if (!isbn) {
      throw new ErrorWithStatus("Book isbn is required", 401);
    }
    const { copies } = req.body;
    if (!copies) {
      throw new ErrorWithStatus("Number of copies is required", 401);
    }
    let copies_array: BookCopy[] = [];
    for (let i = 0; i < copies; i++) {
      copies_array.push({ status: "Returned" });
    }
    const updated_book = await BookModel.updateOne(
      {
        isbn,
      },

      {
        $push: { copies: { $each: copies_array } },
      }
    );
    if (updated_book.modifiedCount === 0) {
      throw new ErrorWithStatus("Book not found", 401);
    }
    res.status(200).json({ success: true, data: updated_book.modifiedCount });
  } catch (error) {
    next(error);
  }
};

//Note: only delete books with no copies
export const delete_book_by_isbn_handler: RequestHandler<
  { isbn: string },
  StandardResponse<number>
> = async (req, res, next) => {
  try {
  
    const token = req.token;
    if (!token) {
      throw new ErrorWithStatus("Token is required to delete a book", 401);
    }
    const { _id: user_id, role } = token;
    if (role !== "LIBRARIAN") {
      throw new ErrorWithStatus("Unauthorized user", 401);
    }
    const { isbn } = req.params;
    if (!isbn) {
      throw new ErrorWithStatus("Book isbn is required", 401);
    }

    const book = await BookModel.findOne({ isbn:isbn });

    if (!book) {
      throw new ErrorWithStatus("Book not found", 401);
    }

    const copies = book.copies;
    let all_copies_returned = true;
    for (let i = 0; i < copies.length; i++) {
      if (copies[i].status !== "Returned") {
        all_copies_returned = false;
        break;
      }
    }
    if (!all_copies_returned) {
      throw new ErrorWithStatus(
        "Book copies must be returned before deleting a book",
        401
      );
    }

    const deleted_book = await BookModel.deleteOne({
      isbn
    });
    if (deleted_book.deletedCount === 0) {
      throw new ErrorWithStatus("Book not found", 401);
    }
    res.status(200).json({ success: true, data: deleted_book.deletedCount });
  } catch (error) {
    next(error);
  }
};

export const get_books_passed_due_date_handler: RequestHandler<
  unknown,
  StandardResponse<Book[]>
> = async (req, res, next) => {
  try {
    const { role } = req.token;
    if (role !== "LIBRARIAN") {
      throw new ErrorWithStatus("Unauthorized user", 401);
    }

    const isbns: string[] = await UserModel.aggregate([
      {
        $match: {
          inventories: { $exists: true, $ne: [] },
        },
      },
      {
        $unwind: "$inventories",
      },
      {
        $match: {
          "inventories.due_date": { $lt: new Date() },
        },
      },
      {
        $project: {
          _id: 0,
          isbn: "$inventories.isbn",
        },
      },
    ]);
    if (isbns.length === 0) {
      throw new ErrorWithStatus("No books passed due date", 404);
    }

    const books = await BookModel.find({ isbn: { $in: isbns } });

    res.status(200).json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};
