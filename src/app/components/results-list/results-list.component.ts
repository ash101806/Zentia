import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { ResultsService } from '../../services/results.service';
import { TestResultSummary } from '../../models/result.model';

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent implements OnInit {
  private resultsService = inject(ResultsService);

  displayedColumns: string[] = ['studentName', 'course', 'group', 'testTitle', 'score'];
  dataSource = new MatTableDataSource<TestResultSummary>();

  uniqueCourses: string[] = [];
  uniqueGroups: string[] = [];

  selectedCourse: string = '';
  selectedGroup: string = '';

  allResults: TestResultSummary[] = [];

  ngOnInit(): void {
    this.resultsService.getResults().subscribe(results => {
      this.allResults = results;
      this.dataSource.data = this.allResults;

      // Extract unique criteria for filters
      this.uniqueCourses = [...new Set(results.map(r => r.course))].sort();
      this.uniqueGroups = [...new Set(results.map(r => r.group))].sort();
    });
  }

  applyFilter(): void {
    let filteredData = this.allResults;

    if (this.selectedCourse) {
      filteredData = filteredData.filter(r => r.course === this.selectedCourse);
    }
    
    if (this.selectedGroup) {
      filteredData = filteredData.filter(r => r.group === this.selectedGroup);
    }

    this.dataSource.data = filteredData;
  }

  clearFilters(): void {
    this.selectedCourse = '';
    this.selectedGroup = '';
    this.dataSource.data = this.allResults;
  }

  getProgressBarColor(percentage: number): string {
    if (percentage >= 80) return 'primary'; // Greenish/Theme Blue usually
    if (percentage >= 60) return 'accent'; // Yellow/Orange
    return 'warn'; // Red
  }

  exportToCSV(): void {
    const data = this.dataSource.data;
    if (!data || data.length === 0) return;

    // Build CSV Headers
    const headers = ['Student Name', 'Course', 'Group', 'Exam Title', 'Score', 'Max Score', 'Percentage'];
    
    // Build CSV Rows
    const rows = data.map(r => [
      `"${r.studentName}"`, 
      `"${r.course}"`, 
      `"${r.group}"`, 
      `"${r.testTitle}"`, 
      r.score, 
      r.maxScore, 
      `"${r.percentage}%"`
    ]);

    // Combine
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    // Create Blob with UTF-8 BOM so Excel opens special characters correctly
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'exam_results.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
