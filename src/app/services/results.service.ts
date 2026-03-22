import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TestResultSummary } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  private mockResults: TestResultSummary[] = [
    {
      id: 'res-1',
      studentName: 'Ana Rodríguez',
      course: 'Matemáticas 3er grado',
      group: 'A',
      testTitle: 'Examen Final de Matemáticas',
      score: 95,
      maxScore: 100,
      percentage: 95.0,
      submittedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'res-2',
      studentName: 'Juan Pérez',
      course: 'Matemáticas 3er grado',
      group: 'B',
      testTitle: 'Examen Final de Matemáticas',
      score: 65,
      maxScore: 100,
      percentage: 65.0,
      submittedAt: new Date(Date.now() - 43200000).toISOString()
    },
    {
      id: 'res-3',
      studentName: 'María García',
      course: 'Historia Mundial',
      group: 'A',
      testTitle: 'Parcial de Historia',
      score: 80,
      maxScore: 100,
      percentage: 80.0,
      submittedAt: new Date().toISOString()
    },
    {
      id: 'res-4',
      studentName: 'Carlos López',
      course: 'Ciencias Naturales',
      group: 'C',
      testTitle: 'Prueba Relámpago',
      score: 40,
      maxScore: 100,
      percentage: 40.0,
      submittedAt: new Date(Date.now() - 1200000).toISOString()
    }
  ];

  constructor() { }

  getResults(): Observable<TestResultSummary[]> {
    return of([...this.mockResults]);
  }
}
