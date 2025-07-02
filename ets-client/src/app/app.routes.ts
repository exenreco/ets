import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { GlobalPagesComponent } from './layouts/global-pages/global-pages.component';
import { SigninComponent } from './signin/signin.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';



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
export const globalPagesRoutes: Routes = [
  { path: '', component: SigninComponent },
  //{ path: 'registration', component: HomeComponent },
  //{ path: 'forgotten-username', component: HomeComponent },
  //{ path: 'forgotten-password', component: HomeComponent },
];

export const dashboardPagesRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'overview', component: HomeComponent },
  { path: 'add-expense', component: AddExpenseComponent },
  //{ path: 'update-expense', component: },
  //{ path: 'remove-expense', component: },
  //{ path: 'list-expenses', component: },
];


export const routes: Routes = [
  {
    path: '',
    component: GlobalPagesComponent,
    children: globalPagesRoutes
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: dashboardPagesRoutes
  }
];
