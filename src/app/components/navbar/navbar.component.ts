import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar mat-elevation-z4">
      <div class="brand">
        <mat-icon class="brand-icon">school</mat-icon>
        <span class="brand-text">Zentia Tests</span>
      </div>

      <div class="spacer"></div>

      <nav class="nav-links">
        <a mat-button routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:true}">{{ 'NAV.HOME' | translate }}</a>
        <a mat-button routerLink="/designer/questions" routerLinkActive="active-link">{{ 'NAV.QUESTION_DESIGNER' | translate }}</a>
        <a mat-button routerLink="/designer/tests" routerLinkActive="active-link">{{ 'NAV.TEST_DESIGNER' | translate }}</a>
      </nav>

      <div class="spacer"></div>

      <!-- Language Switcher integrated in Navbar -->
      <div class="lang-controls">
        <button mat-button [class.active-lang]="currentLang === 'en'" (click)="switchLang('en')">EN</button>
        <span class="divider">|</span>
        <button mat-button [class.active-lang]="currentLang === 'es'" (click)="switchLang('es')">ES</button>
      </div>

      <!-- User Profile Area -->
      <div class="user-controls" *ngIf="currentUser$ | async as user; else loginView">
        <mat-icon class="user-icon">account_circle</mat-icon>
        <div class="user-info">
          <span class="user-name">{{ user.name }}</span>
          <span class="user-role">{{ user.role }}</span>
        </div>
        <button mat-icon-button matTooltip="Logout" (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
        </button>
      </div>

      <ng-template #loginView>
        <button mat-stroked-button color="accent" class="login-btn" (click)="simulateLogin()">
          {{ 'NAV.LOGIN' | translate }}
        </button>
      </ng-template>

    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      padding: 0 24px;
      height: 64px;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .brand-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    
    .brand-text {
      font-size: 1.5rem;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .nav-links {
      display: flex;
      gap: 8px;
    }

    .active-link {
      background: rgba(255, 255, 255, 0.1);
      font-weight: bold;
    }
    
    .lang-controls {
      display: flex;
      align-items: center;
      margin-right: 24px;
    }
    
    .divider {
      color: rgba(255, 255, 255, 0.5);
      margin: 0 4px;
    }
    
    .active-lang {
      font-weight: bold;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
    }
    
    .user-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.1);
      padding: 4px 16px;
      border-radius: 24px;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    
    .user-name {
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .user-role {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .login-btn {
      border-color: rgba(255, 255, 255, 0.5);
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser$: Observable<User | null>;
  currentLang: string = 'en';

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang || 'en';
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  simulateLogin() {
    this.authService.login('student1', 'password123').subscribe();
  }

  logout() {
    this.authService.logout();
  }
}
