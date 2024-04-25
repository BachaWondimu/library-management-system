import { Injectable, effect, inject, signal } from '@angular/core';
import { AuthService, init_state } from '../auth/auth.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

export interface Response {
  success: boolean;
  data: Data;
}

export interface Data {
  added_by: AddedBy;
  _id: string;
  isbn: string;
  title: string;
  author: string;
  price: number;
  copies: string[];
}

export interface AddedBy {
  user_id: string;
  fullname: string;
  email: string;
}

export const book_init_state = {
  success: false,
  data: {
    added_by: {
      user_id: '',
      fullname: '',
      email: '',
    },
    _id: '',
    isbn: '',
    title: '',
    author: '',
    price: 0,
    copies: [],
  },
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #router = inject(Router);
  auth = inject(AuthService);
  snack_sign_out = inject(MatSnackBar);
  #http = inject(HttpClient);
  $book_input = signal<Response>(book_init_state);

  filteredBooks: { id: number; title: string }[] = [];

  constructor() {
    this.$book_input.set(book_init_state);
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  reset_state() {
    this.$book_input.set(book_init_state);
  }

  logOut(): void {
    this.auth.$state.set(init_state);
    this.snack_sign_out.open('Sign out successful!', 'Close', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    this.#router.navigate(['login'], {
      replaceUrl: true,
      skipLocationChange: true,
    });
  }

  ngOnInit() {}

  getBooks(title: string) {
    return this.#http.get<Response>(
      `http://localhost:3000/books/title/${title}`
    );
  }
}
