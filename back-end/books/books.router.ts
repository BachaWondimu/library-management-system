import { Router, json } from "express";
import copiesRouter from "../copies/copies.router";
import {
  get_books_handler,
  post_book_handler,
  get_book_by_title_handler,
  delete_book_by_isbn_handler,
  put_book_by_isbn_handler,
  get_book_by_isbn_handler,
  put_book_by_copies_handler,
  get_books_passed_due_date_handler,
} from "./books.handler";

const booksRouter = Router();

booksRouter.get("/", get_books_handler);
booksRouter.get("/passed-due-date", get_books_passed_due_date_handler);
booksRouter.post("/", json(), post_book_handler);
booksRouter.get("/:isbn", get_book_by_isbn_handler);
booksRouter.get("/title/:title", get_book_by_title_handler);
booksRouter.put("/:isbn", json(), put_book_by_isbn_handler);
booksRouter.put("/add-copies/:isbn", json(), put_book_by_copies_handler);
booksRouter.delete("/:isbn", delete_book_by_isbn_handler);


booksRouter.use("/:isbn/copies", copiesRouter);

export default booksRouter;
