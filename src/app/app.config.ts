import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { PoDialogModule, PoHttpRequestModule } from '@po-ui/ng-components';

import { routes } from './app.routes';
import { plugAuthInterceptor } from './features/boletos/plug.auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom([PoHttpRequestModule, PoDialogModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([plugAuthInterceptor]), withInterceptorsFromDi()),
  ],
};
