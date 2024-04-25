import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SignupService } from '../signup/signup.service';
import { AuthService, init_state } from '../auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { response } from 'express';
import { UserService } from '../../search/search.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  title = inject(Title);
  auth = inject(AuthService);
  #router = inject(Router);
  image = inject(SignupService);
  snackBar = inject(MatSnackBar);

  error_message = signal<string>('');

  form = inject(FormBuilder).nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(3), this.notEmpty],
      ],
    },
    { validators: this.checkLengthPassword }
  );

  get email(): FormControl<string> {
    return this.form.get('email') as FormControl;
  }
  get password(): FormControl<string> {
    return this.form.get('password') as FormControl;
  }

  constructor() {
    this.auth.$is_login_remove.set(true);
    this.image.$is_image.set(true);
  }

  user_credentials = [{ username: 'sree@example.com', password: '123' }];

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  login(): void {
    const email: string = this.email.value;
    const password: string = this.password.value;

    this.auth.login({ email, password }).subscribe({
      next: (response) => {
        if (response.success) {
          this.auth.$state.set({
            success: response.success,
            data: response.data,
          });
          this.snackBar.open('Sign in successful!', 'Close', {
            duration: 2000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.#router.navigate(['home']);
        }
      },
      error: (response) => {
        this.snackBar.open('Sign in failed!', 'Close', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
    });
  }

  ngOnDestroy() {
    this.auth.$is_login_remove.set(false);
    this.image.$is_image.set(false);
  }

  notEmpty(control: AbstractControl) {
    return control.value === '' ? { empty: true } : null;
  }

  checkLengthPassword(control: AbstractControl) {
    return control.get('password')?.value.length >= 3
      ? null
      : { minLength: true };
  }
}
