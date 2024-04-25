import mongoose from "mongoose";

export default function connect_to_db() {
  if (process.env.DB_PATH) {
    mongoose
      .connect(process.env.DB_PATH)
      .then(() => console.log("Connected to database successfully"))
      .catch(console.log);
  } else {
    console.log("Missing database url");
  }
}
