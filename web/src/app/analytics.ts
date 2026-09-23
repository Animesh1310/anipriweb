import { Injectable, afterNextRender, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { siteConfig } from './site-config';
@Injectable({ providedIn: 'root' })
export class Analytics {
  configured = !!siteConfig.analyticsId;
  showConsent = signal(false);
  private enabled = false;
  constructor() {
    afterNextRender(() => {
      if (!this.configured) return;
      const choice = localStorage.getItem('anipri-analytics');
      if (choice === 'yes') this.enable();
      else if (!choice) this.showConsent.set(true);
    });
    inject(Router).events.subscribe((e) => {
      if (e instanceof NavigationEnd && this.enabled) this.pageView();
    });
  }
  private command(...args: unknown[]) {
    const w = window as unknown as { dataLayer: unknown[] };
    w.dataLayer = w.dataLayer || [];
    function gtag(...items: unknown[]) {
      w.dataLayer.push(arguments);
    }
    gtag(...args);
  }
  private enable() {
    if (this.enabled || !this.configured) return;
    this.enabled = true;
    this.command('js', new Date());
    this.command('config', siteConfig.analyticsId, { send_page_view: false });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + siteConfig.analyticsId;
    document.head.appendChild(s);
    this.pageView();
  }
  private pageView() {
    this.command('event', 'page_view', { page_location: location.origin + location.pathname });
  }
  accept() {
    localStorage.setItem('anipri-analytics', 'yes');
    this.showConsent.set(false);
    this.enable();
  }
  decline() {
    localStorage.setItem('anipri-analytics', 'no');
    this.showConsent.set(false);
    if (this.enabled) {
      for (const part of document.cookie.split(';')) {
        const name = part.split('=')[0].trim();
        if (name.startsWith('_ga')) {
          document.cookie = name + '=; Max-Age=0; path=/';
          document.cookie = name + '=; Max-Age=0; path=/; domain=' + location.hostname;
        }
      }
      location.reload();
    }
  }
  lead() {
    if (this.enabled) this.command('event', 'generate_lead', { form_name: 'project_inquiry' });
  }
}
