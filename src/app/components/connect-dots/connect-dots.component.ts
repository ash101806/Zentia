import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { parse } from 'marked';
import { ConnectDotsQuestion, ConnectDotsAnswer, AnswerConnection, ConnectItem } from '../../models/question.model';

@Component({
  selector: 'app-connect-dots',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule],
  template: `
    <div class="question-container">
      <h3 class="question-text">{{ question.text }}</h3>
      <div *ngIf="question.imageUrl" class="question-image">
        <img [src]="question.imageUrl" alt="Reference" />
      </div>
      <div *ngIf="parsedMarkdown" class="markdown-body" [innerHTML]="parsedMarkdown"></div>
      
      <div class="connections-board">
        <div class="column left-column">
          <h4>Items</h4>
          <div *ngFor="let item of question.leftItems" 
               class="connect-item" 
               [class.selected]="selectedLeftId === item.id"
               [class.connected]="isLeftConnected(item.id)"
               (click)="selectLeft(item.id)">
            {{ item.text }}
            <mat-icon *ngIf="isLeftConnected(item.id)" class="connected-icon">check_circle</mat-icon>
          </div>
        </div>

        <div class="column right-column">
          <h4>Matches</h4>
          <div *ngFor="let item of question.rightItems" 
               class="connect-item" 
               [class.selected]="selectedRightId === item.id"
               [class.connected]="isRightConnected(item.id)"
               (click)="selectRight(item.id)">
            <mat-icon *ngIf="isRightConnected(item.id)" class="connected-icon">check_circle</mat-icon>
            {{ item.text }}
          </div>
        </div>
      </div>

      <div class="current-connections" *ngIf="connections.length > 0">
        <h4>Current Connections</h4>
        <div class="connection-pill" *ngFor="let conn of connections; let i = index">
          <span>{{ getLeftText(conn.leftItemId) }} &rarr; {{ getRightText(conn.rightItemId) }}</span>
          <button mat-icon-button color="warn" (click)="removeConnection(i)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
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
    .connections-board {
      display: flex;
      gap: 40px;
      margin-bottom: 24px;
    }
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .connect-item {
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
    }
    .connect-item:hover {
      border-color: #3f51b5;
      background: #f5f5f5;
    }
    .connect-item.selected {
      border-color: #ff4081;
      background: #fff0f5;
      font-weight: bold;
    }
    .connect-item.connected {
      border-color: #4caf50;
      background: #e8f5e9;
      cursor: default;
    }
    .connected-icon {
      color: #4caf50;
    }
    .current-connections {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }
    .connection-pill {
      display: inline-flex;
      align-items: center;
      background: #e0f7fa;
      padding: 8px 16px;
      border-radius: 24px;
      margin: 8px 8px 0 0;
      gap: 8px;
    }
  `]
})
export class ConnectDotsComponent implements OnInit, OnChanges {
  @Input() question!: ConnectDotsQuestion;
  @Input() answer?: ConnectDotsAnswer;
  @Output() answerChange = new EventEmitter<ConnectDotsAnswer>();

  connections: AnswerConnection[] = [];
  selectedLeftId: string | null = null;
  selectedRightId: string | null = null;
  parsedMarkdown?: SafeHtml;
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    if (this.answer && this.answer.connections) {
      this.connections = [...this.answer.connections];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && this.question.markdownContent) {
      Promise.resolve(parse(this.question.markdownContent)).then(p => {
        this.parsedMarkdown = this.sanitizer.bypassSecurityTrustHtml(p);
      });
    }
  }

  selectLeft(id: string) {
    if (this.isLeftConnected(id)) return;
    this.selectedLeftId = id;
    this.tryConnect();
  }

  selectRight(id: string) {
    if (this.isRightConnected(id)) return;
    this.selectedRightId = id;
    this.tryConnect();
  }

  tryConnect() {
    if (this.selectedLeftId && this.selectedRightId) {
      this.connections.push({
        leftItemId: this.selectedLeftId,
        rightItemId: this.selectedRightId
      });
      this.selectedLeftId = null;
      this.selectedRightId = null;
      this.emitChange();
    }
  }

  removeConnection(index: number) {
    this.connections.splice(index, 1);
    this.emitChange();
  }

  isLeftConnected(id: string): boolean {
    return this.connections.some(c => c.leftItemId === id);
  }

  isRightConnected(id: string): boolean {
    return this.connections.some(c => c.rightItemId === id);
  }

  getLeftText(id: string): string {
    return this.question.leftItems.find(i => i.id === id)?.text || '';
  }

  getRightText(id: string): string {
    return this.question.rightItems.find(i => i.id === id)?.text || '';
  }

  private emitChange() {
    this.answerChange.emit({
      questionId: this.question.id,
      type: 'CONNECT_DOTS',
      connections: [...this.connections]
    });
  }
}
