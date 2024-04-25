import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService, book_init_state } from './search.service';
import { AuthService, init_state } from '../auth/auth.service';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { response } from 'express';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class UserComponent {

  title = inject(Title);
  auth = inject(AuthService);
  get_book = inject(UserService);
  snackBar = inject(MatSnackBar);

  form = inject(FormBuilder).nonNullable.group({
    search: ['']
  })

  get search(): FormControl<String> {
    return this.form.get('search') as FormControl;
  }

  constructor() {
  }


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  getBook(): void {
    const searchTerm = this.search.value as string;

    this.get_book.getBooks(searchTerm).subscribe({
      next: (response) => {
        if (response.success) {
            this.get_book.$book_input.set({
            success: response.success,
            data: response.data
          })
        }else{} 

      }, error: response => {
        this.get_book.$book_input.set(book_init_state);
        this.snackBar.open('Could not find the book!', 'Close', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      }
    })
  }


  checkTitle(control: AbstractControl) {

    const searchBook = control.get('search')?.value;

    return true ? null : { untrue: true };
  }

}
