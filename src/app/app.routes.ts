import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/take-exam' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'profile', 
    canActivate: [authGuard], 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) 
  },
  { 
    path: 'take-exam', 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRoles: ['STUDENT'] },
    loadComponent: () => import('./components/take-exam/take-exam.component').then(m => m.TakeExamComponent) 
  },
  {
    path: 'student/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['STUDENT'] },
    loadComponent: () => import('./components/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  { 
    path: 'test/:id', 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRoles: ['STUDENT'] },
    loadComponent: () => import('./components/test-container/test-container.component').then(m => m.TestContainerComponent) 
  },
  { 
    path: 'designer/questions', 
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['TEACHER'] },
    loadComponent: () => import('./components/question-list/question-list.component').then(m => m.QuestionListComponent) 
  },
  { 
    path: 'designer/questions/new', 
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['TEACHER'] },
    loadComponent: () => import('./components/question-designer/question-designer.component').then(m => m.QuestionDesignerComponent) 
  },
  { 
    path: 'designer/questions/:id', 
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['TEACHER'] },
    loadComponent: () => import('./components/question-designer/question-designer.component').then(m => m.QuestionDesignerComponent) 
  },
  { 
    path: 'designer/tests', 
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['TEACHER'] },
    loadComponent: () => import('./components/test-list/test-list.component').then(m => m.TestListComponent) 
  },
  { 
    path: 'designer/tests/new', 
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['TEACHER'] },
    loadComponent: () => import('./components/test-designer/test-designer.component').then(m => m.TestDesignerComponent) 
  },
  { 
    path: 'designer/tests/:id', 
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['TEACHER'] },
    loadComponent: () => import('./components/test-designer/test-designer.component').then(m => m.TestDesignerComponent) 
  },
  {
    path: 'designer/results',
    loadComponent: () => import('./components/results-list/results-list.component').then(m => m.ResultsListComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['TEACHER'] }
  },
  { path: '**', redirectTo: '/take-exam' }
];
