import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      category-list works!
    </p>
  `,
  styles: `

  `
})
export class CategoryListComponent{

}
