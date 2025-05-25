import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideStore()]
};
