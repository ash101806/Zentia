import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}
  public getTranslation(lang: string): Observable<any> {
    return this.http.get(`./assets/i18n/${lang}.json`);
  }
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
