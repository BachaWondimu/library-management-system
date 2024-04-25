import { Component, inject, input, signal } from '@angular/core';
import { Book, bookInit, copiesRequest } from '../../models/models';
import { BooksService } from '../books.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-book.component.html',
  styleUrl: './update-book.component.css',
})
export class UpdateBookComponent {
  #router = inject(Router);
  book_isbn = input<string>('');
  bookService = inject(BooksService);
  book_found = signal<boolean>(false);
  snackbar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  book = signal<Book>(bookInit);

  form = inject(FormBuilder).nonNullable.group({
    number_of_copies: [1, [Validators.required, Validators.min(1)]],
  });

  get number_of_copies() {
    return this.form.get('number_of_copies') as FormControl;
  }

  add_copies() {
    this.bookService
      .add_new_coppies(this.book_isbn(), this.number_of_copies.value)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.snackbar.open('Copies added successfully', 'Close', {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.load_book_data();
          }
        },
        error: (response) => {
          this.snackbar.open(response.error.data, 'Close', {
            duration: 15000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
      });
  }

  delete_copy(copy_id: string) {
    this.bookService.delete_copy(this.book_isbn(), copy_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackbar.open('Copy deleted successfully', 'Close', {
            duration: 2000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.load_book_data();
        }
      },
      error: (response) => {
        this.snackbar.open(response.error.data, 'Close', {
          duration: 15000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
    });
  }

  load_book_data() {
    this.bookService.get_book_by_isbn(this.book_isbn()).subscribe({
      next: (response) => {
        if (response.success) {
          this.book_found.set(true);
          this.book.set(response.data);
        }
      },
      error: (error) => {
        this.book_found.set(false);
        console.error(error);
      },
    });
  }

  delete_book(isbn: string) {
    this.bookService.delete_book(isbn).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackbar.open('Book deleted successfully', 'Close', {
            duration: 2000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.#router.navigate(['view-books']);
        }
      },
      error: (response) => {
        this.snackbar.open(response.error.data, 'Close', {
          duration: 15000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
    });
  }

  ngOnInit() {
    this.load_book_data();
  }
}
