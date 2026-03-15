import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { TestService } from '../../services/test.service';
import { TestResponse, Question, Answer } from '../../models/question.model';
import { MultipleChoiceComponent } from '../multiple-choice/multiple-choice.component';
import { OpenQuestionComponent } from '../open-question/open-question.component';
import { ConnectDotsComponent } from '../connect-dots/connect-dots.component';
import { ConfirmationModalComponent, ConfirmationDialogData } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-test-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    TranslateModule,
    MultipleChoiceComponent,
    OpenQuestionComponent,
    ConnectDotsComponent
  ],
  template: `
    <div class="test-wrapper" *ngIf="testData">
      
      <!-- Header -->
      <mat-card class="test-header mat-elevation-z4">
        <mat-card-content class="header-content">
          <div>
            <h1 class="test-title">{{ 'TEST.TITLE' | translate }}</h1>
            <p class="test-desc">{{ 'TEST.DESC' | translate }}</p>
          </div>

          <div class="timer-container" [class.warning]="timeLeft <= 60" [class.danger]="timeLeft <= 10">
            <mat-icon>timer</mat-icon>
            <span class="time-text">{{ formatTime(timeLeft) }}</span>
          </div>
        </mat-card-content>
        <mat-progress-bar mode="determinate" [value]="progressPercentage"></mat-progress-bar>
      </mat-card>

      <!-- Main Content -->
      <mat-card class="test-body mat-elevation-z2">
        <div class="stepper-nav">
          <button mat-icon-button (click)="previousQuestion()" [disabled]="currentIndex === 0">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span class="question-counter">{{ 'NAV.QUESTION_X_OF_Y' | translate:{current: currentIndex + 1, total: testData.questions.length} }}</span>
          <button mat-icon-button (click)="nextQuestion()" [disabled]="currentIndex === testData.questions.length - 1">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>

        <mat-card-content class="question-view">
          
          <div class="review-later-toggle">
            <button mat-stroked-button color="accent" (click)="toggleReviewLater()" [class.active]="isReviewLater(currentQuestion.id)">
              <mat-icon>{{ isReviewLater(currentQuestion.id) ? 'flag' : 'outlined_flag' }}</mat-icon>
              {{ isReviewLater(currentQuestion.id) ? ('FLAGS.MARKED' | translate) : ('FLAGS.MARK_REVIEW' | translate) }}
            </button>
          </div>

          <div [ngSwitch]="currentQuestion.type">
            <app-multiple-choice 
              *ngSwitchCase="'MULTIPLE_CHOICE'"
              [question]="$any(currentQuestion)" 
              [answer]="getAnswer(currentQuestion.id)"
              (answerChange)="saveAnswer($event)">
            </app-multiple-choice>

            <app-open-question 
              *ngSwitchCase="'OPEN_QUESTION'"
              [question]="$any(currentQuestion)" 
              [answer]="getAnswer(currentQuestion.id)"
              (answerChange)="saveAnswer($event)">
            </app-open-question>

            <app-connect-dots 
              *ngSwitchCase="'CONNECT_DOTS'"
              [question]="$any(currentQuestion)" 
              [answer]="getAnswer(currentQuestion.id)"
              (answerChange)="saveAnswer($event)">
            </app-connect-dots>
          </div>
          
        </mat-card-content>

        <mat-card-actions class="actions-footer">
          <button mat-button (click)="previousQuestion()" [disabled]="currentIndex === 0">{{ 'NAV.PREVIOUS' | translate }}</button>
          
          <div class="spacer"></div>
          
          <button mat-button color="primary" *ngIf="currentIndex < testData.questions.length - 1" (click)="nextQuestion()">{{ 'NAV.NEXT' | translate }}</button>
          <button mat-raised-button color="primary" *ngIf="currentIndex === testData.questions.length - 1" (click)="attemptSubmit()">{{ 'NAV.FINISH' | translate }}</button>
        </mat-card-actions>
      </mat-card>
      
      <!-- Navigation map -->
      <div class="question-map">
        <button *ngFor="let q of testData.questions; let i = index" 
                class="map-dot"
                [class.current]="i === currentIndex"
                [class.answered]="hasAnswer(q.id)"
                [class.review]="isReviewLater(q.id)"
                (click)="jumpToQuestion(i)"
                matTooltip="Question {{ i + 1 }}">
          {{ i + 1 }}
        </button>
      </div>
      
    </div>

    <!-- Loading State -->
    <div class="loading-state" *ngIf="!testData && !isSubmitted">
      <mat-icon class="spinner">refresh</mat-icon>
      <h2>{{ 'TEST.LOADING' | translate }}</h2>
    </div>
    
    <!-- Success State -->
    <div class="success-state" *ngIf="isSubmitted">
      <mat-icon class="success-icon">check_circle</mat-icon>
      <h2>{{ 'TEST.SUCCESS' | translate }}</h2>
      <p>{{ 'TEST.SUCCESS_SUBTEXT' | translate }}</p>
    </div>
  `,
  styles: [`
    .test-wrapper {
      max-width: 900px;
      margin: 40px auto;
      padding: 0 20px;
    }
    
    .test-header {
      margin-bottom: 24px;
      overflow: hidden;
      border-radius: 12px;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
    }
    
    .test-title {
      margin: 0 0 8px 0;
      font-size: 2rem;
      color: #1a237e;
    }
    
    .test-desc {
      margin: 0;
      color: #616161;
      font-size: 1.1rem;
    }
    
    .timer-container {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #e8eaf6;
      padding: 12px 24px;
      border-radius: 30px;
      color: #3f51b5;
      font-weight: bold;
      font-size: 1.5rem;
      transition: all 0.3s ease;
    }
    
    .timer-container.warning {
      background: #fff3e0;
      color: #e65100;
      animation: pulse 2s infinite;
    }
    
    .timer-container.danger {
      background: #ffebee;
      color: #d32f2f;
      animation: fastPulse 1s infinite;
    }
    
    .test-body {
      border-radius: 12px;
      padding-top: 16px;
    }
    
    .stepper-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px 16px;
      border-bottom: 1px solid #eeeeee;
    }
    
    .question-counter {
      font-size: 1.1rem;
      font-weight: 500;
      color: #424242;
    }
    
    .question-view {
      padding: 32px 24px;
      min-height: 300px;
    }
    
    .review-later-toggle {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    
    .review-later-toggle button.active {
      background: #ff4081;
      color: white;
    }
    
    .actions-footer {
      padding: 16px 24px;
      display: flex;
      background: #fafafa;
      border-top: 1px solid #eeeeee;
      border-radius: 0 0 12px 12px;
    }
    
    .spacer {
      flex: 1;
    }
    
    .question-map {
      margin-top: 32px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    
    .map-dot {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #e0e0e0;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #757575;
      transition: all 0.2s;
    }
    
    .map-dot:hover {
      border-color: #3f51b5;
    }
    
    .map-dot.answered {
      background: #e0f2f1;
      border-color: #009688;
      color: #00796b;
    }
    
    .map-dot.review {
      background: #fce4ec;
      border-color: #e91e63;
      color: #c2185b;
    }
    
    .map-dot.current {
      border-color: #3f51b5;
      background: #3f51b5;
      color: white;
      box-shadow: 0 4px 8px rgba(63, 81, 181, 0.3);
    }
    
    .loading-state, .success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: #424242;
    }
    
    .success-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #4caf50;
      margin-bottom: 24px;
    }
    
    .spinner {
      animation: spin 1s linear infinite;
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #3f51b5;
      margin-bottom: 24px;
    }
    
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
    @keyframes fastPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class TestContainerComponent implements OnInit, OnDestroy {
  testData: TestResponse | null = null;
  currentIndex: number = 0;
  answers: Map<string, Answer> = new Map();
  reviewLaterIds: Set<string> = new Set();
  
  timeLeft: number = 0;
  timerSubscription?: Subscription;
  isSubmitted = false;

  constructor(
    private testService: TestService,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    const testId = 'test-123'; // Mock ID
    const studentId = 'student-456'; // Mock ID
    
    this.testService.getTest(testId, studentId).subscribe(data => {
      this.testData = data;
      this.timeLeft = data.timeLimitSeconds;
      this.startTimer();
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  get currentQuestion(): Question {
    return this.testData!.questions[this.currentIndex];
  }

  get progressPercentage(): number {
    if (!this.testData) return 0;
    return (this.answers.size / this.testData.questions.length) * 100;
  }

  startTimer() {
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0 && !this.isSubmitted))
      .subscribe(() => {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          this.autoSubmit();
        }
      });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  nextQuestion() {
    if (this.testData && this.currentIndex < this.testData.questions.length - 1) {
      this.currentIndex++;
    }
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  jumpToQuestion(index: number) {
    this.currentIndex = index;
  }

  saveAnswer(answer: any) {
    this.answers.set(answer.questionId, answer);
  }

  getAnswer(questionId: string): any {
    return this.answers.get(questionId);
  }

  hasAnswer(questionId: string): boolean {
    return this.answers.has(questionId);
  }

  toggleReviewLater() {
    const qId = this.currentQuestion.id;
    if (this.reviewLaterIds.has(qId)) {
      this.reviewLaterIds.delete(qId);
    } else {
      this.reviewLaterIds.add(qId);
    }
  }

  isReviewLater(questionId: string): boolean {
    return this.reviewLaterIds.has(questionId);
  }

  attemptSubmit() {
    const dialogData: ConfirmationDialogData = {
      totalQuestions: this.testData!.questions.length,
      answeredCount: this.answers.size,
      reviewLaterCount: this.reviewLaterIds.size
    };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submit();
      }
    });
  }

  autoSubmit() {
    alert(this.translateService.instant('TEST.AUTO_SUBMIT_ALERT'));
    this.submit();
  }

  private submit() {
    this.stopTimer();
    this.isSubmitted = true;
    
    const submission = {
      applicationId: this.testData!.applicationId,
      studentId: this.testData!.studentId,
      answers: Array.from(this.answers.values())
    };

    this.testService.submitTest(this.testData!.testId, submission).subscribe();
  }

  switchLang(lang: string) {
    this.translateService.use(lang);
  }
}
