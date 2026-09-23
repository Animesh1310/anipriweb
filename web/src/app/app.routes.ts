import { Routes } from '@angular/router';
import { Page } from './page';
import { services, industries } from './content';
export const routes: Routes = [
  { path: '', component: Page, data: { kind: 'home' } },
  { path: 'services', component: Page, data: { kind: 'services' } },
  ...services.map((item) => ({
    path: 'services/' + item.slug,
    component: Page,
    data: { kind: 'service', item },
  })),
  { path: 'industries', component: Page, data: { kind: 'industries' } },
  ...industries.map((industry) => ({
    path: 'industries/' + industry.slug,
    component: Page,
    data: { kind: 'industry', industry },
  })),
  { path: 'our-work', component: Page, data: { kind: 'work' } },
  { path: 'about', component: Page, data: { kind: 'about' } },
  { path: 'contact', component: Page, data: { kind: 'contact' } },
  { path: 'privacy', component: Page, data: { kind: 'privacy' } },
  { path: '404', component: Page, data: { kind: 'notfound' } },
  { path: '**', component: Page, data: { kind: 'notfound' } },
];
