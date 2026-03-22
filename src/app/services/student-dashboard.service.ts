import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StudentDashboardResponse } from '../models/student-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {

  private mockDashboardData: StudentDashboardResponse = {
    upcomingExams: [
      {
        id: 'test-124',
        title: 'Examen de Ciencias Naturales',
        course: 'Ciencias 3er grado',
        scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        timeLimitSeconds: 3600,
        status: 'SCHEDULED'
      },
      {
        id: 'test-125',
        title: 'Historia de México: Revolución',
        course: 'Historia 3er grado',
        scheduledDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        timeLimitSeconds: 5400,
        status: 'SCHEDULED'
      }
    ],
    pastExams: [
      {
        id: 'res-x1',
        title: 'Examen Medio Término: Matemáticas',
        course: 'Matemáticas 3er grado',
        score: 95,
        maxScore: 100,
        percentage: 95.0,
        submittedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
        status: 'COMPLETED'
      },
      {
        id: 'res-x2',
        title: 'Prueba de Ortografía GeNERAL',
        course: 'Español 3er grado',
        score: 70,
        maxScore: 100,
        percentage: 70.0,
        submittedAt: new Date(Date.now() - 86400000 * 25).toISOString(), // 25 days ago
        status: 'COMPLETED'
      }
    ]
  };

  constructor() { }

  getStudentDashboard(studentId: string): Observable<StudentDashboardResponse> {
    return of(this.mockDashboardData);
  }
}
