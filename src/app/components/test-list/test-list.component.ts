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
import { TestBlueprint } from '../../models/question.model';

@Component({
  selector: 'app-test-list',
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
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.scss'
})
export class TestListComponent implements OnInit {
  blueprints: TestBlueprint[] = [];
  displayedColumns: string[] = ['title', 'description', 'createdByName', 'updatedByName', 'actions'];
  isLoading = true;

  private designerService = inject(DesignerService);
  private router = inject(Router);

  ngOnInit() {
    this.loadBlueprints();
  }

  loadBlueprints() {
    this.isLoading = true;
    this.designerService.getTestBlueprints().subscribe(bps => {
      this.blueprints = bps;
      this.isLoading = false;
    });
  }

  createNew() {
    this.router.navigate(['/designer/tests/new']);
  }

  editBlueprint(id: string) {
    this.router.navigate(['/designer/tests', id]);
  }
}
