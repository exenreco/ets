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
import { QAndAComponent } from './q-and-a/q-and-a.component';


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
  { path: '404', component: ErrorDashboardComponent, data: {title:'Error: 404'} },
  { path: 'overview', component: OverviewComponent, data: {title:'Account Overview'} },
  { path: 'add-expense', component: ExpenseAddComponent, data: {title:'Add Expense'} },
  { path: 'update-expense', component: ExpenseUpdateComponent, data: {title:'Update Expense'} },
  { path: 'q-and-a', component: QAndAComponent, data: {title:'Questions and answers'} },
  //{ path: 'update-expense', component: },
  //{ path: 'remove-expense', component: },
  { path: 'expense-list', component: ExpenseListComponent, data: {title: 'Expense List'} },
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
