import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/test-container/test-container.component').then(m => m.TestContainerComponent) },
  { path: 'designer/questions', loadComponent: () => import('./components/question-designer/question-designer.component').then(m => m.QuestionDesignerComponent) },
  { path: 'designer/tests', loadComponent: () => import('./components/test-designer/test-designer.component').then(m => m.TestDesignerComponent) }
];
