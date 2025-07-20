import { NgModule } from '@angular/core';
import { authGuard } from './security/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './layouts/dashboard/overview/overview.component';
import { SigninComponent } from './security/signin/signin.component';
import { ExpenseAddComponent } from './expenses/expense-add/expense-add.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { GlobalPagesComponent } from './layouts/global-pages/global-pages.component';
import { RegistrationComponent } from './security/registration/registration.component';
import { ErrorGlobalComponent } from './layouts/global-pages/error-global/error-global.component';
import { ForgottenPasswordComponent } from './security/forgotten-password/forgotten-password.component';
import { ForgottenUsernameComponent } from './security/forgotten-username/forgotten-username.component';
import { ErrorDashboardComponent } from './layouts/dashboard/error-dashboard/error-dashboard.component';
import { ExpenseListComponent } from './expenses/expense-list/expense-list.component';
import { ExpenseUpdateComponent } from './expenses/expense-update/expense-update.component';
import { DeleteExpenseComponent } from './expenses/delete-expense/delete-expense.component';
import { QAndAComponent } from './support/q-and-a/q-and-a.component';
import { ContactComponent } from './support/contact/contact.component';
import { SettingsComponent } from './settings/settings.component';
import { ExpenseByIdComponent } from './expenses/expense-by-id/expense-by-id.component';
import { RequestAdvisorComponent } from './support/request-advisor/request-advisor.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoryAddComponent } from './categories/category-add/category-add.component';
import { CategoryUpdateComponent } from './categories/category-update/category-update.component';
import { CategoryByIdComponent } from './categories/category-by-id/category-by-id.component';
import { SearchResultsComponent } from './expenses/search-results/search-results.component';


/**
 * User Management Routes: {
 *
 *    Routes that uses the main layout @ src/layouts/GlobalPages,
 *
 *    Anyone will see these pages since authentication is not required.
 *
 * }
 */
export const userManagementRoutes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'server-error', component: ErrorGlobalComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'registration', component: RegistrationComponent},
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'forgotten-username', component: ForgottenUsernameComponent },
  { path: '**', redirectTo: 'server-error', pathMatch: 'full' },
];

/**
 * Authenticated Routes: {
 *
 *    Routes that uses the dashboard layout @ src/layouts/dashboard,
 *
 *    Only authenticated users are allowed to see these routes
 *
 * }
 */
export const authenticatedRoutes: Routes = [
  { path: '', redirectTo: '/dashboard/overview', pathMatch: 'full' },
  { path: '404', component: ErrorDashboardComponent, data: {title:'Invalid request'} },
  { path: 'overview', component: OverviewComponent, data: {title:'Account Overview'} },
  { path: 'add-expense', component: ExpenseAddComponent, data: {title:'Create a new expense'} },
  { path: 'expense-list', component: ExpenseListComponent, data: {title: 'All expenses'} },
  { path: 'update-expense', component: ExpenseUpdateComponent, data: {title:'Update expenses'} },
  { path: 'expense-by-id', component: ExpenseByIdComponent, data: {title: 'Expense by Id'} },
  { path: 'add-category', component: CategoryAddComponent, data: {title: 'Create a new expense category'} },
  { path: 'update-category', component: CategoryUpdateComponent, data: {title:'Update category'} },
  { path: 'q-and-a', component: QAndAComponent, data: {title:'Questions & answers'} },
  { path: 'contact', component: ContactComponent, data: {title:'Send us a message'} },
  { path: 'search-results', component: SearchResultsComponent, data: {title:'Search results'} },
  { path: 'account-setting', component: SettingsComponent, data: {title:'Account settings'} },
  { path: 'financial-advisor', component: RequestAdvisorComponent, data: {title:'Request an advisor'} },
  { path: 'delete-expense', component: DeleteExpenseComponent, data: {title:'Delete an expense'} },
  { path: 'category-list', component: CategoryListComponent, data: {title:'All categories'} },
  { path: 'category-by-id', component: CategoryByIdComponent, data: {title: 'Category by Id'} },
  { path: '**', redirectTo: '/dashboard/404', pathMatch: 'full' },
];


export const routes: Routes = [
  { // authenticated routes
    path:             'dashboard',
    children:         authenticatedRoutes,
    component:        DashboardComponent,
    canActivate:      [ authGuard ],
    canActivateChild: [ authGuard ],
  },
  { // none authenticated routes
    path:       '',
    children:   userManagementRoutes,
    component:  GlobalPagesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
