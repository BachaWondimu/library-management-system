import { RequestHandler } from "express";
import { ErrorWithStatus, StandardResponse } from "../helpers/types";
import { UserBook } from "./inventories.schema";
import { UserModel } from "../users/users.model";
import { Book, BookModel } from "../books/books.model";
import mongoose from "mongoose";

export const get_inventories_handler: RequestHandler<
  unknown,
  StandardResponse<UserBook[]>,
  unknown,
  { page: number }
> = async (req, res, next) => {
  try {
    const user_id = req.token._id;
    if (!user_id) throw new ErrorWithStatus("user_id is required", 400);

    const { page } = req.query || 1;

    const userInventory: UserBook[] = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(user_id) } },
      { $unwind: "$inventories" },
      { $sort: { "inventories.dueDate": -1 } },
      {
        $replaceRoot: {
          newRoot: "$inventories",
        },
      },
    ]);
    if (userInventory.length === 0) {
      throw new ErrorWithStatus("You don't have any borrowed books", 404);
    }
    res.status(200).json({ success: true, data: userInventory });
  } catch (error) {
    next(error);
  }
};

export const post_inventory_handler: RequestHandler<
  { user_id: string },
  StandardResponse<string>,
  UserBook
> = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    if (!user_id) throw new ErrorWithStatus("user_id is required", 400);
    const { isbn, copy_id, title, dueDate } = req.body;
    const book = await UserModel.updateOne(
      { isbn: isbn, "copies.copy_id": copy_id },
      { $set: { copies: { "copies.$.status": "Borrowed" } } }
    );
    if (!book) throw new ErrorWithStatus("Book not found", 404);
    const user = await UserModel.updateOne(
      { user_id },
      { $push: { inventories: { isbn, copy_id, title, dueDate } } }
    );
    if (!user) throw new ErrorWithStatus("User not found", 404);
    res.status(201).json({ success: true, data: "UserBook created" });
  } catch (error) {
    next(error);
  }
};

export const get_inventory_by_id_handler: RequestHandler<
  { user_id: string; inventory_id: string },
  StandardResponse<UserBook>,
  unknown
> = async (req, res, next) => {
  try {
    const { user_id, inventory_id } = req.params;
    if (!user_id) throw new ErrorWithStatus("user_id is required", 400);
    if (!inventory_id)
      throw new ErrorWithStatus("inventory_id is required", 400);
    const user = await UserModel.findOne(
      { _id: user_id, "inventories._id": inventory_id },
      { _id: 0, "inventories.$": 1 }
    );
    if (!user) throw new ErrorWithStatus("User not found", 404);
    res.status(200).json({ success: true, data: user.inventories[0] });
  } catch (error) {
    next(error);
  }
};

export const put_book_in_inventory_by_id_handler: RequestHandler<
  { isbn: string },
  StandardResponse<string>
> = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    if (!isbn) throw new ErrorWithStatus("isbn is required", 400);
    const book = await BookModel.findOne({ isbn: isbn });
    if (!book) throw new ErrorWithStatus("Book not found", 404);
    const bookCopies = await BookModel.aggregate([
      { $match: { isbn: isbn } },
      { $unwind: "$copies" },
      { $match: { "copies.status": "Returned" } },
      { $project: { _id: "$copies._id", copy_id: "$copies.status" } },
    ]);
    if (bookCopies.length === 0)
      throw new ErrorWithStatus("No copies available", 404);
    const token = req.token;
    const { _id: user_id, email, fullname, role } = token;
    const bookInUserInventory = await UserModel.findOne(
      { _id: user_id, "inventories.isbn": isbn },
      { _id: 0, inventories: 1 }
    );
    if (bookInUserInventory) {
      throw new ErrorWithStatus("Book already in inventory", 400);
    }

    const bookToAdd: UserBook = {
      isbn: book.isbn,
      title: book.title,
      copy_id: bookCopies[0]._id,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    };

    const bookresult = await BookModel.updateOne(
      { isbn: isbn, "copies._id": bookCopies[0]._id },
      { $set: { "copies.$.status": "Borrowed" } }
    );

    const result = await UserModel.updateOne(
      { _id: user_id },
      { $push: { inventories: bookToAdd } }
    );

    if (result.modifiedCount === 0) {
      throw new ErrorWithStatus("Book not added to inventory", 400);
    }

    res.status(200).json({ success: true, data: "Book borrowed successfully" });
  } catch (error) {
    next(error);
  }
};

export const delete_book_from_inventory_by_id_handler: RequestHandler<
  { isbn: string; copy_id: string },
  StandardResponse<string>
> = async (req, res, next) => {
  try {
    const { isbn, copy_id } = req.params;
    if (!isbn) throw new ErrorWithStatus("isbn is required", 400);
    if (!copy_id) throw new ErrorWithStatus("copy_id is required", 400);
    const user_id = req.token._id;
    const bookInUserInventory = await UserModel.findOne(
      {
        _id: user_id,
        "inventories.isbn": isbn,
        "inventories.copy_id": copy_id,
      },
      { _id: 0, inventories: 1 }
    );
    if (!bookInUserInventory) {
      throw new ErrorWithStatus("Book not found in inventory", 404);
    }
    const result = await UserModel.updateOne(
      { _id: user_id },
      { $pull: { inventories: { isbn: isbn, copy_id: copy_id } } }
    );
    if (result.modifiedCount === 0) {
      throw new ErrorWithStatus("Book not removed from inventory", 400);
    }
    const bookresult = await BookModel.updateOne(
      { isbn: isbn, "copies._id": copy_id },
      { $set: { "copies.$.status": "Returned" } }
    );
    if (bookresult.modifiedCount === 0) {
      throw new ErrorWithStatus("Book status not updated", 400);
    }

    res.status(200).json({ success: true, data: "Book returned successfully" });
  } catch (error) {
    next(error);
  }
};
