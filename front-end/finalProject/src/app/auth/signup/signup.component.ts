import { Component, inject } from '@angular/core';
import { SignupService } from './signup.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  image = inject(SignupService);

  #router = inject(Router);
  sign_up = inject(SignupService);
  snackBar = inject(MatSnackBar);

  form = inject(FormBuilder).nonNullable.group(
    {
      fullname: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      password2: ['', [Validators.required, Validators.minLength(3)]],
    },
    { validators: [this.checkPassword, this.checkLengthPassword] }
  );

  get fullname(): FormControl<string> {
    return this.form.get('fullname') as FormControl;
  }
  get email(): FormControl<string> {
    return this.form.get('email') as FormControl;
  }
  get password(): FormControl<string> {
    return this.form.get('password') as FormControl;
  }
  get password2(): FormControl<string> {
    return this.form.get('password2') as FormControl;
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  signup() {
    const fullname = this.fullname.value;
    const email = this.email.value;
    const password = this.password.value;

    this.sign_up.registerUser({ fullname, email, password }).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Sign up successful!', 'Close', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

          this.#router.navigate(['login']);
        }
      },
      error: (response) => {
        this.snackBar.open('Sign up failed!', 'Close', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
    });
  }

  checkPassword(control: AbstractControl) {
    const password = control.get('password')?.value;
    const password2 = control.get('password2')?.value;

    return password === password2 ? null : { unmatch: true };
  }

  constructor() {
    this.image.$is_image.set(true);
  }
  ngOnDestroy() {
    this.image.$is_image.set(false);
  }

  checkLengthPassword(control: AbstractControl) {
    return control.get('password')?.value.length >= 3
      ? null
      : { minLength: true };
  }

  checkBalance(control: AbstractControl) {
    const balance = control.get('balance');

    return balance?.value >= 0 && balance?.value <= 100
      ? null
      : { notTrue: true };
  }
}
