import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService, Category } from '../../categories/categories.service';
import { AuthService } from '../../security/auth.service';
import { Expense, ExpensesService } from '../expenses.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-expense-search',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink ],
  template: `
    <form class="__form searchExpenseForm" [formGroup]="searchExpenseForm" autocomplete="off" (ngSubmit)="onSearch()">

      <h2 class="__widget_title">
        Search Expenses:
        <small style="font-size: .725rem">filtering by: {{ selectedFilter }}</small>
      </h2><hr>

      <div class="__grid columns __search_container">
        @if ( selectedFilter === 'minimum' ) {

          <input
            id="minAmount"
            type="number"
            name="minAmount"
            class="__field"
            placeholder="Min amount in $"
            formControlName="minAmount"
          >

        } @else if ( selectedFilter === 'maximum' ) {

          <input
            id="maxAmount"
            type="number"
            name="maxAmount"
            class="__field"
            placeholder="Max amount in $"
            formControlName="maxAmount"
          >

        } @else if ( selectedFilter === 'start-date' ) {

          <input
            id="startDate"
            type="date"
            name="startDate"
            class="__field"
            formControlName="startDate"
          >

        } @else if ( selectedFilter === 'end-date' ) {

          <input
            id="endDate"
            type="date"
            name="endDate"
            class="__field"
            formControlName="endDate"
          >

        } @else if ( selectedFilter === 'category' ) {

          <select
            id="categoryId"
            name="categoryId"
            title="Categories list"
            formControlName="categoryId"
            class="__field"
          >
            <option value="" disabled>select a category</option>
            @for (cat of categories; track cat) {
              <option [value]="cat.categoryId">{{cat.name}}</option>
            }
          </select>

        } @else {

          <input
            type="text"
            id="description"
            name="description"
            class="description __field"
            formControlName="description"
            placeholder="Search by description..."
          >

        }

        <div class="__filters" (click)="toggleFilter()" title="filter search by">
          <div class="trigger">
            <i class="fa-solid fa-filter"></i>
            <!--<i class="fa-solid fa-chevron-down" [class.open]="filterOpen"></i>-->
          </div>
          @if( filterOpen ) {
            <ul class="__filter_menu" [class.open]="filterOpen">
              <li class="placeholder">filter search by...</li>
              <li class="option" (click)="selectFilter('category'); $event.stopPropagation()">Category</li>
              <li class="option" (click)="selectFilter('description'); $event.stopPropagation()">Description</li>
              <li class="option" (click)="selectFilter('minimum'); $event.stopPropagation()">min Amount in $</li>
              <li class="option" (click)="selectFilter('maximum'); $event.stopPropagation()">Max Amount in $</li>
              <li class="option" (click)="selectFilter('end-date'); $event.stopPropagation()">To Date (Ending at)</li>
              <li class="option" (click)="selectFilter('start-date'); $event.stopPropagation()">From Date (Starting at)</li>
            </ul>
          }
        </div>
        <input type="hidden" formControlName="filter" />

        <button
          type="submit"
          title="search"
          class="__search __button tertiary"
          [disabled]="
            searchExpenseForm.invalid
            ||
              searchExpenseForm.get('filter')?.value === 'description'
              && !searchExpenseForm.get('description')?.value
            ||
              searchExpenseForm.get('filter')?.value === 'minimum'
              && !searchExpenseForm.get('minAmount')?.value
            ||
              searchExpenseForm.get('filter')?.value === 'maximum'
              && !searchExpenseForm.get('maxAmount')?.value
            ||
              searchExpenseForm.get('filter')?.value === 'category'
              && !searchExpenseForm.get('categoryId')?.value
            ||
              searchExpenseForm.get('filter')?.value === 'start-date'
              && !searchExpenseForm.get('startDate')?.value
            ||
              searchExpenseForm.get('filter')?.value === 'end-date'
              && !searchExpenseForm.get('endDate')?.value
          "
        ><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
    </form>
  `,
  styles: `
    .searchExpenseForm {
      margin: 0 0 4em 0;
      padding: 0;
      background: transparent;
    }
    .__search_container {
      gap: 0px;
      color: #333;
      width: 100%;
      padding: 0px;
      background: #fff;
      border-radius: .4em;
      flex-wrap: nowrap;
      align-items: flex-start;
      justify-items: flex-start;
      justify-content: center;
      display: block;
    }
    .__search_container > * {
      flex: 0 0 auto;
      align-items: center;
      justify-items: left;
      justify-content: left;
    }
      .__form_title {
        margin: 0;
        padding: 0;
        color: #fff;
      }
      .__filters, .__search, .__field {
        margin: 0;
        padding: 0;
        display: inline-block;
      }
      .__field {
        margin: 0;
        padding: 2px;
        height: 40px;
        border-radius: 0;
        text-align: left;
        text-indent: 12px;
        width: calc(100% - 69px);
        max-width: calc(100% - 69px);
        min-width: calc(100% - 69px);
        border: 0px solid transparent;
        border-top-left-radius: .4em;
        border-bottom-left-radius: .4em;
      }
      .__search_container:has(.__field:focus) {
        outline: .2em solid var(--secondary-color, #DD2D4A);
      }
      .__field:focus {
        border: none;
        outline: none;
      }
      .__filters {
        width: auto;
        max-width: none;
        min-width: none;
      }
      .__filters .trigger {
        top: 0;
        margin: 0;
        bottom: 0;
        right: 30.5px;
        width: 30px;
        padding: 4px;
        display: flex;
        flex: 1 1 auto;
        cursor: pointer;
        position: absolute;
        font-size: .825rem;
        flex-direction: row;
        align-items: center;
        justify-items: center;
        justify-content: center;
        background: var(--primary-color-shade, #F26A8D);
      }
      .__search {
        top: 0;
        right: 0;
        bottom: 0;
        width: 30px;
        height: 100%;
        padding: 4px;
        box-sizing: non;
        border-radius: 0;
        position: absolute;
        border-top-right-radius: .4em;
        border-bottom-right-radius: .4em;
      }
      .__filters .__filter_menu {
        display: none;
        visibility: hidden;
      }
      .__filters .__filter_menu.open {
        left: 0;
        top: 48px;
        color: #fff;
        width: 100%;
        z-index: 99;
        padding: 4px;
        display: flex;
        cursor: pointer;
        font-size: .925rem;
        position: absolute;
        visibility: visible;
        flex-direction: column;
        align-items: flex-start;
        justify-items: flex-start;
        justify-content: flex-start;
        background: var(--secondary-color, #DD2D4A);
      }
      .__filters .__filter_menu.open .option {
        display: block;
        font-weight: 100;
        position: relative;
        font-size: .9425rem;
        width: calc(100% - 8px);
        padding: 8px 4px 8px 4px;
        transition: all 300ms ease-in-out;
      }
      .__filters .__filter_menu.open .option:hover {
        color: #333;
        background: var(--complimentary-color-soft-blue, #CBEEF3);
        transition: all 300ms ease-in-out;
      }
      .__filters .__filter_menu.open .placeholder {
        padding: 4px;
        color:rgb(212, 212, 212);
        font-weight: 100;
        width: calc(100% - 8px);
        border-bottom: 1px solid rgb(204, 201, 201);
      }
    .__widget_title {
      width: 100%;
      display: flex;
      flex: 0 0 auto;
      font-size: 1rem;
      line-height: 1.2rem;
      font-weight: bolder;
      flex-direction: column;
      align-items: flex-start;
      justify-items: flex-start;
      justify-content: center;
    }
  `
})
export class ExpenseSearchComponent implements OnInit {

  searched = false;

  filterOpen = false;

  results: Expense[] = [];

  categories: Category[] = [];

  private destroy$ = new Subject<void>();

  searchExpenseForm = this.fb.group({
    filter:       ['', Validators.required],
    endDate:      [''],
    startDate:    [''],
    minAmount:    [''],
    maxAmount:    [''],
    categoryId:   [''],
    description:  ['']
  });

  constructor(

    private router: Router,

    private fb: FormBuilder,

    private expensesService: ExpensesService,

    private categoriesService: CategoriesService

  ) {}

  get selectedFilter(): string {
    return this.searchExpenseForm.get('filter')?.value || '';
  }

  ngOnInit(): void {

    // set default search filter
    this.selectFilter('description');

    // store all categories owned by user
    this.categoriesService.getAllCategoriesByUserId().subscribe({
      next:(res) => this.categories = res,
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  selectFilter(filter: 'category'|'description'|'minimum'|'maximum'|'start-date'|'end-date') {
    this.filterOpen = false;
    this.searchExpenseForm.patchValue({ filter });
    this.resetOtherControls(filter);
    this.searched = false;
  }
  resetOtherControls(active: string) {
    const allControls = [
      'minAmount',
      'maxAmount',
      'endDate',
      'categoryId',
      'startDate',
      'description',
    ];

    allControls.forEach(ctrl => {
      if (!active.includes(ctrl)) {
        this.searchExpenseForm.get(ctrl)?.reset();
      }
    });
  }


  onSearch(): void {
    if (this.searchExpenseForm.invalid) return;

    this.searched = false;

    const
      params: any = {},
      form = this.searchExpenseForm.value,
      payload = encodeURIComponent(JSON.stringify(form));
    ;

    if (form.description) params.description = form.description;
    if (form.minAmount) params.minAmount = form.minAmount;
    if (form.maxAmount) params.maxAmount = form.maxAmount;
    if (form.startDate) params.startDate = form.startDate;
    if (form.endDate) params.endDate = form.endDate;
    if (form.categoryId) params.categoryId = form.categoryId;

    this.expensesService.searchExpenses(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.results = data;
          this.searched = true;
          this.router.navigate(
            ['/dashboard/search-results'],
            { queryParams: { q: payload } }
          );
        },
        error: err => {
          this.searched = true;
          console.log(`search error: ${err}`)
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
