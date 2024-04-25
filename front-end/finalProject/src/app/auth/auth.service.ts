import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';

export interface Response {
  success: boolean;
  data: Data;
}

export interface Data {
  token: string;
  user: User;
}

export interface User {
  fullname: string;
  _id: string;
  role: string;
}

export const init_state = {
  success: false,
  data: {
    token: '',
    user: {
      fullname: '',
      _id: '',
      role: '',
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $is_login_remove = signal<boolean>(false);
  $state = signal<Response>(init_state);

  readonly #http = inject(HttpClient);

  constructor() {
    effect(() => {
      localStorage.setItem('User', JSON.stringify(this.$state()));
    });
  }

  login(credentials: { email: string; password: string }) {
    return this.#http.post<Response>(
      'http://localhost:3000/users/signin',
      credentials
    );
  }

  is_logged_in() {
    return this.$state().success ? true : false;
  }

  is_admin() {
    return this.$state().data.user.role === 'LIBRARIAN' ? true : false;
  }
}
