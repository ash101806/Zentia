import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('school_app_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Simulated login based on our API Contracts
  login(username: string, password: string): Observable<AuthResponse> {
    const isTeacher = username.toLowerCase() === 'teacher';
    
    const mockResponse: AuthResponse = {
      token: isTeacher ? 'teacher_token_123' : 'student_token_123',
      user: {
        id: isTeacher ? 'teacher-888' : 'student-456',
        name: isTeacher ? 'Mr. Teacher' : 'Jane Doe',
        email: isTeacher ? 'teacher@school.edu' : 'jane.doe@school.edu',
        role: isTeacher ? 'TEACHER' : 'STUDENT',
        ...(isTeacher 
          ? { assignedClasses: ['Math 3rd grade', 'Science 3rd grade'] }
          : { gradeClass: '3rd grade' })
      }
    };

    return of(mockResponse).pipe(
      delay(600),
      tap(response => {
        localStorage.setItem('school_app_user', JSON.stringify(response.user));
        localStorage.setItem('school_app_token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('school_app_user');
    localStorage.removeItem('school_app_token');
    this.currentUserSubject.next(null);
  }
}
