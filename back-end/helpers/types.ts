export class ErrorWithStatus extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}
export interface StandardResponse<T> {
  success: boolean;
  data: T;
}
export interface Token {
  _id: string;
  fullname: string;
  email: string;
  role: "LIBRARIAN" | "USER";
}
export interface RequestBodyBook {
  isbn: string;
  title: string;
  author: string;
  price: number;
  number_of_copies: number;
}
