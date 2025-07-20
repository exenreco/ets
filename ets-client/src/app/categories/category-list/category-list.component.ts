import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="__page category-page">

      @if (categories && categories.length > 0) {
        <table class="category-page__table">
          <thead class="category-page__table-head">
            <tr class="category-page__table-row">
              <th class="category-page__table-header">Category</th>
              <th class="category-page__table-header">Description</th>
              <th class="category-page__table-header">Created On</th>

            </tr>
          </thead>
          <tbody class="category-page__table-body">
            @for (category of categories; track category) {
              <tr class="category-page__table-row">
                <td class="category-page__table-cell">{{ category.name}}</td>
                <td class="category-page__table-cell">{{ category.description }}</td>
                <td class="category-page__table-cell">{{ category.dateCreated | date }}</td>

              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="__grid rows">
          <span>
            <span class="category-page__no-categories">There are no Categories available, try adding some categories!</span>
            <!-- <a class="__link" routerLink="/dashboard/add-category"> Add Category</a> -->
          </span>
        </div>
      }
    </div>
  `,
  styles: `
    .category-page__table {
      background-color: #EFF2F7;
      border: 1px solid #C0CCDA;
    }
    .category-page__table-header {
      text-align: left;
      font-weight: bold;
      padding: 25px 25px 40px 25px;
    }
    .category-page__table-cell {
      text-align: left;
      padding: 25px 25px 40px 25px;
      border-top: 1px solid #C0CCDA;
      border-bottom: 1px solid #C0CCDA;
    }
    .category-page__table-body tr:nth-child(even) {
      background-color: #F9FAFC;
    }
    .category-page__table-body tr:nth-child(odd) {
      background-color: #ffffff;
    }
  `
})
export class CategoryListComponent implements OnInit {

  errorMessage: string = '';
  categories: any[] = [];
  constructor(private categoriesService: CategoriesService) {}
  ngOnInit(): void {
    this.categoriesService.getAllCategoriesByUserId().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.errorMessage = err;
        console.error('Error fetching categories:', err);
      }
    });
  }
}
