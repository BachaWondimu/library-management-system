import { Component, inject, signal } from '@angular/core';
import { UserInventory, inventoryInit } from '../../models/models';
import { BooksService } from '../books.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {
  inventory = signal<UserInventory[]>([]);
  bookService = inject(BooksService);
  snackbar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  get_user_inventory() {
    this.bookService.get_user_inventory().subscribe({
      next: (response) => {
        if (response.success) {
          this.inventory.set(response.data);
        }
      },
      error: (response) => {
        this.inventory.set([]);
      },
    });
  }

  ngOnInit(): void {
    this.get_user_inventory();
  }

  constructor() {
    this.get_user_inventory();
  }

  return_book(isbn: string, copy_id: string) {
    this.bookService.return_book(isbn, copy_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackbar.open('Book returned successfully', 'Close', {
            duration: 2000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_user_inventory();
        }
      },
      error: (response) => {
        this.snackbar.open(response.error.message, 'Close', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
    });
  }
}
