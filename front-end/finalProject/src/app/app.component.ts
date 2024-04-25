import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from './shared/components/page-header.component';
import { SignupService } from './auth/signup/signup.service';
import { UserService } from './search/search.service';
``;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: `./app.component.html`,
  styleUrl: `./app.component.css`,
})
export class AppComponent {
  title = 'Library System';
  image = inject(SignupService);
}
