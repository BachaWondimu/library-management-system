import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../search/search.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  title = 'Library System';
  auth = inject(AuthService);
  user_sign_out = inject(UserService);
  image = inject;
}
