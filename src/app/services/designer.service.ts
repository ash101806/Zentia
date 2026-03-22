import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Question, TestBlueprint } from '../models/question.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  private authService = inject(AuthService);
  
  // Mock internal database array
  private mockQuestions: Question[] = [];
  private mockTestBlueprints: TestBlueprint[] = [];

  constructor() { }

  getQuestions(): Observable<Question[]> {
    return of([...this.mockQuestions]).pipe(delay(400));
  }

  getQuestion(id: string): Observable<Question | undefined> {
    const q = this.mockQuestions.find(x => x.id === id);
    return of(q).pipe(delay(400));
  }

  saveQuestion(question: Question): Observable<Question> {
    console.log('Saving question to server:', question);
    const currentUser = this.authService.currentUserValue;
    const authorName = currentUser ? currentUser.name : 'Unknown';

    let saved: Question;
    
    if (question.id) {
      // Update existing
      const idx = this.mockQuestions.findIndex(q => q.id === question.id);
      if (idx > -1) {
        saved = { ...question, updatedByName: authorName };
        this.mockQuestions[idx] = saved;
      } else {
        // Fallback if ID sent but not found
        saved = { ...question, createdByName: authorName, updatedByName: authorName };
        this.mockQuestions.push(saved);
      }
    } else {
      // Insert new
      const newId = 'q-' + Math.random().toString(36).substr(2, 9);
      saved = { ...question, id: newId, createdByName: authorName, updatedByName: authorName };
      this.mockQuestions.push(saved);
    }
    
    return of(saved).pipe(delay(800));
  }

  getTestBlueprints(): Observable<TestBlueprint[]> {
    return of([...this.mockTestBlueprints]).pipe(delay(400));
  }

  getTestBlueprint(id: string): Observable<TestBlueprint | undefined> {
    const bp = this.mockTestBlueprints.find(x => x.id === id);
    return of(bp).pipe(delay(400));
  }

  saveTestBlueprint(blueprint: TestBlueprint): Observable<TestBlueprint> {
    console.log('Saving test blueprint to server:', blueprint);
    const currentUser = this.authService.currentUserValue;
    const authorName = currentUser ? currentUser.name : 'Unknown';

    let saved: TestBlueprint;

    if (blueprint.id) {
      const idx = this.mockTestBlueprints.findIndex(bp => bp.id === blueprint.id);
      if (idx > -1) {
        saved = { ...blueprint, updatedByName: authorName };
        this.mockTestBlueprints[idx] = saved;
      } else {
        saved = { ...blueprint, createdByName: authorName, updatedByName: authorName };
        this.mockTestBlueprints.push(saved);
      }
    } else {
      const newId = 'bp-' + Math.random().toString(36).substr(2, 9);
      saved = { ...blueprint, id: newId, createdByName: authorName, updatedByName: authorName };
      this.mockTestBlueprints.push(saved);
    }

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
