import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <img src="assets/lib-image02.jpg" alt="Description of the image" class="lib-image">
  `,
  styles: `
  
  .lib-image {
     width: 100%;
     height: 500px;
     object-fit: contain;
 }`
})
export class HomeComponent {}
