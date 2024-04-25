import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { Route, Routes, provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserService } from './search/search.service';
import { LoginService } from './auth/login/login.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideProtractorTestingSupport } from '@angular/platform-browser';
import { addTokenInterceptor } from './add-token.interceptor';


const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full', title: "Library System"},
  {path: 'home', loadComponent: () => import('./home.component').then(c => c.HomeComponent), title: "Library System"},
  {path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent), title: "Login"},
  {path: 'signup', loadComponent: () => import('./auth/signup/signup.component').then(c => c.SignupComponent), title: "User Sign-Up"},
  {path: 'about', loadComponent: () => import('./auth/about/about.component').then(c => c.AboutComponent), title: "About"},
  {path: 'search', loadComponent: () => import('./search/search.component').then(c => c.UserComponent), title: "Search Book",
    canActivate: [() => inject(AuthService).is_logged_in()]
  },
  {path: 'view-books', loadComponent: () => import('./books/view-books/view-books.component').then(c => c.ViewBooksComponent), title: "View Books"},
  {path: 'add-book', loadComponent: () => import('./books/add-book/add-book.component').then(c => c.AddBookComponent), title: "Add Book",
    canActivate: [() => inject(AuthService).is_logged_in()  && inject(AuthService).is_admin()]
  },
  {path: 'update-book/:book_isbn', loadComponent: () => import('./books/update-book/update-book.component').then(c => c.UpdateBookComponent), title: "Update Book",
    canActivate: [() => inject(AuthService).is_logged_in()  && inject(AuthService).is_admin()]
  },
  {path: 'inventory', loadComponent: () => import('./books/inventory/inventory.component').then(c => c.InventoryComponent), title: "Inventory",
    canActivate: [() => inject(AuthService).is_logged_in()]
  },

];

const bootstrap = () => {
    const auth = inject(AuthService);

    return () => {
      const local_state = localStorage.getItem('User');

      if(local_state){
        auth.$state.set(JSON.parse(local_state));
      }
    }
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes, withComponentInputBinding(), 
    withViewTransitions(), withInMemoryScrolling()), provideHttpClient(withInterceptors([addTokenInterceptor])), 
    provideAnimationsAsync(), {provide: APP_INITIALIZER, multi:true, useFactory:bootstrap}, provideAnimationsAsync()]
};
