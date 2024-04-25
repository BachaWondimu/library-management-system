import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";

import connect_to_db from "./helpers/database";
import { myErrorHandler, noRouteHandler } from "./helpers/handlers";
import usersRouter from "./users/users.router";
import booksRouter from "./books/books.router";
import { validateUser } from "./users/users.middleware";

const app = express();

connect_to_db();

app.use(morgan("dev"));
app.use(cors());

app.use("/users", usersRouter);
app.use("/books", validateUser, booksRouter);
app.all("*", noRouteHandler);

app.use(myErrorHandler);

app.listen(3000, () => console.log("Server is up and running on port 3000"));
