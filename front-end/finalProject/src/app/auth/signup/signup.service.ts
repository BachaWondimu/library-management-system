import { Injectable, inject, signal } from '@angular/core';
import { User } from '../auth.service';
import { HttpClient } from '@angular/common/http';

export interface User_Register {
  success: boolean;
  data: string;
}

export const register_state = {
  success: false,
  data: '',
};

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  $is_image = signal<boolean>(false);

  $sign_up_state = signal<User_Register>(register_state);

  #http = inject(HttpClient);

  constructor() {}

  registerUser(registerCredentials: {
    fullname: string;
    email: string;
    password: string;
  }) {
    return this.#http.post<User_Register>(
      'http://localhost:3000/users/signup',
      registerCredentials
    );
  }

  is_signed_up() {
    return this.$sign_up_state().data ? true : false;
  }
}
