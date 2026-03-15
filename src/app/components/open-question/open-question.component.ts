import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { parse } from 'marked';
import { OpenQuestion, OpenQuestionAnswer } from '../../models/question.model';

@Component({
  selector: 'app-open-question',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <div class="question-container">
      <h3 class="question-text">{{ question.text }}</h3>
      <div *ngIf="question.imageUrl" class="question-image">
        <img [src]="question.imageUrl" alt="Reference" />
      </div>
      <div *ngIf="parsedMarkdown" class="markdown-body" [innerHTML]="parsedMarkdown"></div>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Your answer</mat-label>
        <textarea matInput rows="6" [(ngModel)]="textResponse" (ngModelChange)="onResponseChange()"></textarea>
      </mat-form-field>
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
    .full-width {
      width: 100%;
    }
  `]
})
export class OpenQuestionComponent implements OnChanges {
  @Input() question!: OpenQuestion;
  @Input() answer?: OpenQuestionAnswer;
  @Output() answerChange = new EventEmitter<OpenQuestionAnswer>();

  textResponse: string = '';
  parsedMarkdown?: SafeHtml;
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    if (this.answer) {
      this.textResponse = this.answer.textResponse;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && this.question.markdownContent) {
      Promise.resolve(parse(this.question.markdownContent)).then(p => {
        this.parsedMarkdown = this.sanitizer.bypassSecurityTrustHtml(p);
      });
    }
  }

  onResponseChange() {
    this.answerChange.emit({
      questionId: this.question.id,
      type: 'OPEN_QUESTION',
      textResponse: this.textResponse
    });
  }
}
