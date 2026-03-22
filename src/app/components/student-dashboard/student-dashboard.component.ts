import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { StudentDashboardService } from '../../services/student-dashboard.service';
import { AuthService } from '../../services/auth.service';
import { StudentUpcomingExam, StudentPastExam } from '../../models/student-dashboard.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    TranslateModule
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  private dashboardService = inject(StudentDashboardService);
  private authService = inject(AuthService);

  upcomingExams: StudentUpcomingExam[] = [];
  pastExams: StudentPastExam[] = [];

  upcomingColumns: string[] = ['title', 'course', 'scheduledDate', 'duration', 'action'];
  pastColumns: string[] = ['title', 'course', 'submittedAt', 'score'];

  ngOnInit(): void {
    const userId = this.authService.currentUserValue?.id || 'student-123';

    this.dashboardService.getStudentDashboard(userId).subscribe(data => {
      this.upcomingExams = data.upcomingExams;
      this.pastExams = data.pastExams;
    });
  }

  getProgressBarColor(percentage: number): string {
    if (percentage >= 80) return 'primary';
    if (percentage >= 60) return 'accent';
    return 'warn';
  }
}
