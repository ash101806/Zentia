import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DesignerService } from '../../services/designer.service';
import { TestBlueprint, QuestionType, Question } from '../../models/question.model';

@Component({
  selector: 'app-test-designer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './test-designer.component.html',
  styleUrls: ['./test-designer.component.scss']
})
export class TestDesignerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private designerService = inject(DesignerService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  blueprintForm!: FormGroup;
  editingTestId: string | null = null;
  loadedTest: TestBlueprint | null = null;

  questionTypes: { value: QuestionType | 'ANY', label: string }[] = [
    { value: 'ANY', label: 'DESIGNER.TYPE_ANY' },
    { value: 'MULTIPLE_CHOICE', label: 'DESIGNER.TYPE_MC' },
    { value: 'OPEN_QUESTION', label: 'DESIGNER.TYPE_OPEN' },
    { value: 'CONNECT_DOTS', label: 'DESIGNER.TYPE_CONNECT' }
  ];

  courses: string[] = [];
  availableQuestions: Question[] = [];

  ngOnInit(): void {
    this.initForm();
    this.designerService.getCourses().subscribe(c => this.courses = c);
    this.designerService.getQuestions().subscribe(q => this.availableQuestions = q);

    this.editingTestId = this.route.snapshot.paramMap.get('id');
    if (this.editingTestId) {
      this.designerService.getTestBlueprint(this.editingTestId).subscribe(bp => {
        if (bp) {
          this.loadedTest = bp;
          this.patchFormWithBlueprint(bp);
        } else {
          this.snackBar.open('Test not found', 'Close');
          this.router.navigate(['/designer/tests']);
        }
      });
    }
  }

  private patchFormWithBlueprint(bp: TestBlueprint) {
    this.blueprintForm.patchValue({
      title: bp.title,
      description: bp.description,
      timeLimitMinutes: bp.timeLimitSeconds ? Math.floor(bp.timeLimitSeconds / 60) : 60,
      fixedQuestionIds: bp.fixedQuestionIds || []
    });

    if (bp.rules && bp.rules.length > 0) {
      this.rules.clear();
      bp.rules.forEach(rule => {
        this.rules.push(this.fb.group({
          course: [rule.course || '', Validators.required],
          topic: [rule.topic || ''],
          questionType: [rule.questionType || 'ANY', Validators.required],
          count: [rule.count, [Validators.required, Validators.min(1)]]
        }));
      });
    }
  }

  private initForm(): void {
    this.blueprintForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      timeLimitMinutes: [60, [Validators.required, Validators.min(1)]],
      fixedQuestionIds: [[]],
      rules: this.fb.array([this.createRule()])
    });
  }

  get rules(): FormArray {
    return this.blueprintForm.get('rules') as FormArray;
  }

  createRule(): FormGroup {
    return this.fb.group({
      course: ['', Validators.required],
      topic: [''],
      questionType: ['ANY', Validators.required],
      count: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addRule(): void {
    this.rules.push(this.createRule());
  }

  removeRule(index: number): void {
    if (this.rules.length > 1) {
      this.rules.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.blueprintForm.valid) {
      const formValue = this.blueprintForm.value;
      const blueprint: TestBlueprint = {
        id: this.editingTestId || '',
        title: formValue.title,
        description: formValue.description,
        timeLimitSeconds: formValue.timeLimitMinutes * 60,
        fixedQuestionIds: formValue.fixedQuestionIds,
        rules: formValue.rules
      };
      
      this.designerService.saveTestBlueprint(blueprint).subscribe({
        next: () => {
          this.snackBar.open(this.translate.instant('TEST_DESIGNER.SAVE_SUCCESS'), 'Close', { duration: 3000 });
          this.router.navigate(['/designer/tests']);
        },
        error: () => this.snackBar.open(this.translate.instant('TEST_DESIGNER.SAVE_ERROR'), 'Close', { duration: 3000 })
      });
    } else {
      this.blueprintForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/designer/tests']);
  }
}
