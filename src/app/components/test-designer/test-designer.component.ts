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
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DesignerService } from '../../services/designer.service';
import { TestBlueprint, QuestionType } from '../../models/question.model';

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

  blueprintForm!: FormGroup;

  questionTypes: { value: QuestionType | 'ANY', label: string }[] = [
    { value: 'ANY', label: 'DESIGNER.TYPE_ANY' },
    { value: 'MULTIPLE_CHOICE', label: 'DESIGNER.TYPE_MC' },
    { value: 'OPEN_QUESTION', label: 'DESIGNER.TYPE_OPEN' },
    { value: 'CONNECT_DOTS', label: 'DESIGNER.TYPE_CONNECT' }
  ];

  courses: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.designerService.getCourses().subscribe(c => this.courses = c);
  }

  private initForm(): void {
    this.blueprintForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
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
      const blueprint: TestBlueprint = this.blueprintForm.value;
      
      this.designerService.saveTestBlueprint(blueprint).subscribe({
        next: () => {
          this.snackBar.open(this.translate.instant('TEST_DESIGNER.SAVE_SUCCESS'), 'Close', { duration: 3000 });
          this.blueprintForm.reset();
          this.rules.clear();
          this.addRule();
        },
        error: () => this.snackBar.open(this.translate.instant('TEST_DESIGNER.SAVE_ERROR'), 'Close', { duration: 3000 })
      });
    } else {
      this.blueprintForm.markAllAsTouched();
    }
  }
}
