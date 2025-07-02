import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { GlobalPagesComponent } from './layouts/global-pages/global-pages.component';
import { SigninComponent } from './security/signin/signin.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { OverviewComponent } from './overview/overview.component';
import { ForgottenPasswordComponent } from './security/forgotten-password/forgotten-password.component';
import { ForgottenUsernameComponent } from './security/forgotten-username/forgotten-username.component';
import { RegistrationComponent } from './security/registration/registration.component';



/**
 * Global pages routes
 *
 * This module defines the routes for global pages such as the
 * signin, reset password and username and registration pages.
 *
 * These routes are used in the global pages layout component
 * where no authentication is required.
 *
 * @module GlobalPagesRoutes
 */
export const securityRoutes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'registration', component: RegistrationComponent},
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'forgotten-username', component: ForgottenUsernameComponent },
];

export const dashboardPagesRoutes: Routes = [
  { path: '', component: OverviewComponent, data: {title:'Account Overview'} },
  { path: 'overview', component: OverviewComponent, data: {title:'Account Overview'} },
  { path: 'add-expense', component: AddExpenseComponent, data: {title:'Add Expense'} },
  //{ path: 'update-expense', component: },
  //{ path: 'remove-expense', component: },
  //{ path: 'list-expenses', component: },
];


export const routes: Routes = [
  {
    path: '',
    component: GlobalPagesComponent,
    children: securityRoutes
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: dashboardPagesRoutes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
