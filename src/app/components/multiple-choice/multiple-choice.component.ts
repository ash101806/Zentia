import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { parse } from 'marked';
import { MultipleChoiceQuestion, MultipleChoiceAnswer } from '../../models/question.model';

@Component({
  selector: 'app-multiple-choice',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `
    <div class="question-container">
      <h3 class="question-text">{{ question.text }}</h3>
      <div *ngIf="question.imageUrl" class="question-image">
        <img [src]="question.imageUrl" alt="Reference" />
      </div>
      <div *ngIf="parsedMarkdown" class="markdown-body" [innerHTML]="parsedMarkdown"></div>
      <mat-radio-group [(ngModel)]="selectedOptionId" (change)="onSelectionChange()">
        <mat-radio-button *ngFor="let opt of question.options" [value]="opt.id">
          {{ opt.text }}
        </mat-radio-button>
      </mat-radio-group>
    </div>
  `,
  styles: [`
    .question-container {
      margin-bottom: 20px;
    }
    .question-text {
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .question-image {
      margin-bottom: 16px;
      text-align: center;
    }
    .question-image img {
      max-width: 100%;
      border-radius: 8px;
    }
    .markdown-body {
      margin-bottom: 20px;
      background: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
    }
    mat-radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `]
})
export class MultipleChoiceComponent implements OnChanges {
  @Input() question!: MultipleChoiceQuestion;
  @Input() answer?: MultipleChoiceAnswer;
  @Output() answerChange = new EventEmitter<MultipleChoiceAnswer>();

  selectedOptionId?: string;
  parsedMarkdown?: SafeHtml;
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    if (this.answer) {
      this.selectedOptionId = this.answer.selectedOptionId;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && this.question.markdownContent) {
      Promise.resolve(parse(this.question.markdownContent)).then(p => {
        this.parsedMarkdown = this.sanitizer.bypassSecurityTrustHtml(p);
      });
    }
  }

  onSelectionChange() {
    if (this.selectedOptionId) {
      this.answerChange.emit({
        questionId: this.question.id,
        type: 'MULTIPLE_CHOICE',
        selectedOptionId: this.selectedOptionId
      });
    }
  }
}
