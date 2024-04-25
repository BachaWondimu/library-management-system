import { Component, inject, signal } from '@angular/core';
import { Book, BookCopy } from '../../models/models';
import { BooksService } from '../books.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './view-books.component.html',
  styleUrl: './view-books.component.css',
})
export class ViewBooksComponent {
  books = signal<Book[]>([]);
  bookservice = inject(BooksService);
  snackbar = inject(MatSnackBar);
  auth = inject(AuthService);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  get_all_books() {
    this.bookservice.get_all_books().subscribe({
      next: (response) => {
        if (response.success) {
          this.books.set(response.data);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  constructor() {
    this.get_all_books();
  }

  getReturnedCopiesCount(book: Book) {
    return book.copies.filter((copy: BookCopy) => copy.status === 'Returned')
      .length;
  }

  borrowBook(isbn: string) {
    this.bookservice.add_book_to_inventory(isbn).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackbar.open(response.data, 'Close', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_all_books();
        }
      },
      error: (response) => {
        console.error(response);
        this.snackbar.open(response.error.data, 'Close', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
    });
  }
}
