import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (auth.$state().data) {
    const reqWithToken = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${auth.$state().data.token}`
      ),
    });
    return next(reqWithToken);
  }
  return next(req);
};
