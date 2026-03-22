import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DesignerService } from '../../services/designer.service';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule, 
    MatTableModule,
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  displayedColumns: string[] = ['course', 'topic', 'text', 'type', 'createdByName', 'updatedByName', 'actions'];
  isLoading = true;

  private designerService = inject(DesignerService);
  private router = inject(Router);

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.isLoading = true;
    this.designerService.getQuestions().subscribe(qs => {
      this.questions = qs;
      this.isLoading = false;
    });
  }

  createNew() {
    this.router.navigate(['/designer/questions/new']);
  }

  editQuestion(id: string) {
    this.router.navigate(['/designer/questions', id]);
  }
}
