import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { BooksService } from '../books.service';
import { addBook } from '../../models/models';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css',
})
export class AddBookComponent {
  #router = inject(Router);
  bookService = inject(BooksService);
  snackbar = inject(MatSnackBar);

  form = inject(FormBuilder).nonNullable.group({
    isbn: ['', [Validators.required]],
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    price: [100, [Validators.required]],
    copies: [1, [Validators.required, Validators.min(1)]],
  });

  get isbn() {
    return this.form.get('isbn') as FormControl;
  }
  get title() {
    return this.form.get('title') as FormControl;
  }
  get author() {
    return this.form.get('author') as FormControl;
  }
  get price() {
    return this.form.get('price') as FormControl;
  }
  get copies() {
    return this.form.get('copies') as FormControl;
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  addBook() {
    const bookInfo: addBook = {
      isbn: this.isbn.value,
      title: this.title.value,
      author: this.author.value,
      price: this.price.value,
      number_of_copies: this.copies.value,
    };

    this.bookService.add_book(bookInfo).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackbar.open('Book added successfully', 'Close', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.#router.navigate(['view-books']);
        }
      },
      error: (response) => {
        this.snackbar.open(response.error.data, 'Close', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
    });
  }
}
