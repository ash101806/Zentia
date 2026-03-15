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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { parse } from 'marked';

import { DesignerService } from '../../services/designer.service';
import { QuestionType, Question } from '../../models/question.model';

@Component({
  selector: 'app-question-designer',
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
  templateUrl: './question-designer.component.html',
  styleUrls: ['./question-designer.component.scss']
})
export class QuestionDesignerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private designerService = inject(DesignerService);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);
  private translate = inject(TranslateService);

  questionForm!: FormGroup;
  courses: string[] = [];
  topics: string[] = [];
  
  questionTypes: { value: QuestionType, label: string }[] = [
    { value: 'MULTIPLE_CHOICE', label: 'DESIGNER.TYPE_MC' },
    { value: 'OPEN_QUESTION', label: 'DESIGNER.TYPE_OPEN' },
    { value: 'CONNECT_DOTS', label: 'DESIGNER.TYPE_CONNECT' }
  ];

  parsedMarkdown: SafeHtml = '';

  ngOnInit(): void {
    this.initForm();
    this.loadCourses();

    this.questionForm.get('course')?.valueChanges.subscribe(course => {
      if (course) {
        this.loadTopics(course);
      }
    });

    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      this.updateFormStructure(type);
    });

    this.questionForm.get('markdownContent')?.valueChanges.subscribe(markdown => {
      if (markdown) {
        Promise.resolve(parse(markdown)).then(parsed => {
           this.parsedMarkdown = this.sanitizer.bypassSecurityTrustHtml(parsed);
        });
      } else {
        this.parsedMarkdown = '';
      }
    });
  }

  private initForm(): void {
    this.questionForm = this.fb.group({
      type: ['MULTIPLE_CHOICE', Validators.required],
      text: ['', Validators.required],
      course: ['', Validators.required],
      topic: ['', Validators.required],
      imageUrl: [''],
      markdownContent: ['']
    });
    this.updateFormStructure('MULTIPLE_CHOICE');
  }

  private loadCourses(): void {
    this.designerService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  private loadTopics(course: string): void {
    this.designerService.getTopics(course).subscribe(topics => {
      this.topics = topics;
    });
  }

  private updateFormStructure(type: QuestionType): void {
    if (this.questionForm.contains('options')) {
      this.questionForm.removeControl('options');
    }
    if (this.questionForm.contains('leftItems')) {
      this.questionForm.removeControl('leftItems');
    }
    if (this.questionForm.contains('rightItems')) {
      this.questionForm.removeControl('rightItems');
    }

    if (type === 'MULTIPLE_CHOICE') {
      this.questionForm.addControl('options', this.fb.array([
        this.createOption(), this.createOption()
      ]));
    } else if (type === 'CONNECT_DOTS') {
      this.questionForm.addControl('leftItems', this.fb.array([this.createItem(), this.createItem()]));
      this.questionForm.addControl('rightItems', this.fb.array([this.createItem(), this.createItem()]));
    }
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get leftItems(): FormArray {
    return this.questionForm.get('leftItems') as FormArray;
  }

  get rightItems(): FormArray {
    return this.questionForm.get('rightItems') as FormArray;
  }

  createOption(): FormGroup {
    return this.fb.group({
      id: ['opt-' + Math.random().toString(36).substr(2, 5)],
      text: ['', Validators.required]
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      id: ['item-' + Math.random().toString(36).substr(2, 5)],
      text: ['', Validators.required]
    });
  }

  addOption(): void {
    this.options.push(this.createOption());
  }

  removeOption(index: number): void {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  addConnectRow(): void {
    this.leftItems.push(this.createItem());
    this.rightItems.push(this.createItem());
  }

  removeConnectRow(index: number): void {
    if (this.leftItems.length > 2) {
      this.leftItems.removeAt(index);
      this.rightItems.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const questionData: Question = this.questionForm.value;
      this.designerService.saveQuestion(questionData).subscribe({
        next: (saved) => {
          this.snackBar.open(this.translate.instant('DESIGNER.SAVE_SUCCESS'), 'Close', { duration: 3000 });
          this.questionForm.reset({ type: questionData.type, course: questionData.course, topic: questionData.topic });
        },
        error: () => {
          this.snackBar.open(this.translate.instant('DESIGNER.SAVE_ERROR'), 'Close', { duration: 3000 });
        }
      });
    } else {
      this.questionForm.markAllAsTouched();
    }
  }
}
