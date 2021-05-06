import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { TimelineComponent } from './timeline/timeline.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import {TodoComponent} from './todo/todo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'timeline',
    component: TimelineComponent,
    canActivate: [AuthGuard],
    /*data: {
      title: 'Terms of use'
    },*/
  },
  {
    path: 'todo',
    component: TodoComponent,
    /*canActivate: [AuthGuard],*/
  },
  { path: '**', redirectTo: '/registration', pathMatch: 'full' },
];
