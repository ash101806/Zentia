import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TestResponse, TestSubmission } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor() {}

  getTest(testId: string, studentId: string): Observable<TestResponse> {
    const mockData: TestResponse = {
      applicationId: 'app-789-xyz',
      studentId: studentId,
      testId: testId,
      title: 'History Midterm',
      description: 'Midterm covering chapters 1-5',
      timeLimitSeconds: 60 * 5, // 5 minutes for demo
      questions: [
        {
          id: 'q1',
          type: 'MULTIPLE_CHOICE',
          text: 'Who was the first president of the United States?',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/220px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg',
          markdownContent: '**Fun Fact**: He was also a successful liquor distributor in the new country.',
          options: [
            { id: 'opt1', text: 'George Washington' },
            { id: 'opt2', text: 'Thomas Jefferson' },
            { id: 'opt3', text: 'Abraham Lincoln' },
            { id: 'opt4', text: 'John Adams' }
          ]
        },
        {
          id: 'q2',
          type: 'OPEN_QUESTION',
          text: 'Explain the significance of the Emancipation Proclamation.',
          markdownContent: 'Please read the following excerpt before answering:\n\n> "That on the first day of January, in the year of our Lord one thousand eight hundred and sixty-three..."'
        },
        {
          id: 'q3',
          type: 'CONNECT_DOTS',
          text: 'Match the event to the year.',
          imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=400&auto=format&fit=crop',
          leftItems: [
            { id: 'l1', text: 'Declaration of Independence' },
            { id: 'l2', text: 'US Civil War Ends' },
            { id: 'l3', text: 'Moon Landing' }
          ],
          rightItems: [
            { id: 'r1', text: '1865' },
            { id: 'r2', text: '1776' },
            { id: 'r3', text: '1969' }
          ]
        }
      ]
    };
    
    // Simulate network delay
    return of(mockData).pipe(delay(800));
  }

  submitTest(testId: string, submission: TestSubmission): Observable<{ success: boolean }> {
    console.log('Test submitted:', testId, submission);
    return of({ success: true }).pipe(delay(800));
  }
}
