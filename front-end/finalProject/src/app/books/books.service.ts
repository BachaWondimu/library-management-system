import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Book,
  addBook,
  addBookResponse,
  addBookToInventoryResponse,
  updateCopiesResponse,
  getAllBookResponse,
  getBookResponse,
  userInventoryResponse,
  returnBookResponse,
  deleteBookResponse,
} from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  readonly #http = inject(HttpClient);

  add_book(book: addBook) {
    return this.#http.post<addBookResponse>(
      'http://localhost:3000/books',
      book
    );
  }

  get_all_books() {
    return this.#http.get<getAllBookResponse>('http://localhost:3000/books/');
  }

  add_book_to_inventory(isbn: string) {
    return this.#http.put<addBookToInventoryResponse>(
      `http://localhost:3000/users/inventories/${isbn}`,
      {}
    );
  }

  get_book_by_isbn(isbn: string) {
    return this.#http.get<getBookResponse>(
      `http://localhost:3000/books/${isbn}`
    );
  }

  add_new_coppies(isbn: string, copies: number) {
    return this.#http.put<updateCopiesResponse>(
      `http://localhost:3000/books/add-copies/${isbn}`,
      { copies }
    );
  }

  delete_copy(isbn: string, copy_id: string) {
    return this.#http.delete<updateCopiesResponse>(
      `http://localhost:3000/books/${isbn}/copies/${copy_id}`
    );
  }

  get_user_inventory() {
    return this.#http.get<userInventoryResponse>(
      `http://localhost:3000/users/inventories`
    );
  }

  return_book(isbn: string, copy_id: string) {
    return this.#http.delete<returnBookResponse>(
      `http://localhost:3000/users/inventories/${isbn}/${copy_id}`,
      {}
    );
  }

  delete_book(isbn: string) {
    return this.#http.delete<deleteBookResponse>(
      `http://localhost:3000/books/${isbn}`
    );
  }
  constructor() {}
}
