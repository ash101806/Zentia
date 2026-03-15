import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  totalQuestions: number;
  answeredCount: number;
  reviewLaterCount: number;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Submit Test?</h2>
    <mat-dialog-content>
      <div class="summary-box">
        <div class="summary-item">
          <mat-icon color="primary">check_circle</mat-icon>
          <span>Answered: <strong>{{ data.answeredCount }} / {{ data.totalQuestions }}</strong></span>
        </div>
        
        <div class="summary-item" *ngIf="unansweredCount > 0">
          <mat-icon color="warn">error_outline</mat-icon>
          <span class="warn-text">Unanswered: <strong>{{ unansweredCount }}</strong></span>
        </div>
        
        <div class="summary-item" *ngIf="data.reviewLaterCount > 0">
          <mat-icon color="accent">flag</mat-icon>
          <span class="accent-text">Marked for Review: <strong>{{ data.reviewLaterCount }}</strong></span>
        </div>
      </div>
      <p>Are you sure you want to submit your test? You will not be able to change your answers after submission.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Continue Test</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">Submit Test</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .summary-box {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .summary-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.1rem;
    }
    .warn-text {
      color: #f44336;
    }
    .accent-text {
      color: #ff4081;
    }
  `]
})
export class ConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}

  get unansweredCount(): number {
    return this.data.totalQuestions - this.data.answeredCount;
  }
}
