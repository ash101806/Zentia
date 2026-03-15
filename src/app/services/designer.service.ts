import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Question, TestBlueprint } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  constructor() { }

  saveQuestion(question: Question): Observable<Question> {
    console.log('Saving question to server:', question);
    const saved = { ...question, id: question.id || 'q-' + Math.random().toString(36).substr(2, 9) };
    return of(saved as Question).pipe(delay(800));
  }

  saveTestBlueprint(blueprint: TestBlueprint): Observable<TestBlueprint> {
    console.log('Saving test blueprint to server:', blueprint);
    const saved = { ...blueprint, id: blueprint.id || 'bp-' + Math.random().toString(36).substr(2, 9) };
    return of(saved).pipe(delay(800));
  }

  getCourses(): Observable<string[]> {
    return of(['Math 3rd grade', 'History Midterm', 'Science 101', 'Literature']).pipe(delay(300));
  }

  getTopics(course: string): Observable<string[]> {
    const topics: Record<string, string[]> = {
      'Math 3rd grade': ['Addition', 'Subtraction', 'Fractions'],
      'History Midterm': ['US Presidents', 'World War II', 'Ancient Rome'],
      'Science 101': ['Biology', 'Chemistry', 'Physics'],
      'Literature': ['Shakespeare', 'Modern Poetry', 'Novel Analysis']
    };
    return of(topics[course] || ['General']).pipe(delay(300));
  }
}
