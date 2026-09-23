import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize, timeout } from 'rxjs';
import { services, industries } from './content';
import { Analytics } from './analytics';
import { siteConfig } from './site-config';
@Component({ standalone: true, imports: [RouterLink, FormsModule], templateUrl: './page.html' })
export class Page {
  analytics = inject(Analytics);
  services = services;
  industries = industries;
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  doc = inject(DOCUMENT);
  platform = inject(PLATFORM_ID);
  kind = this.route.snapshot.data['kind'] as string;
  item = this.route.snapshot.data['item'] as (typeof services)[number] | undefined;
  industry = this.route.snapshot.data['industry'] as (typeof industries)[number] | undefined;
  formConfigured = !!siteConfig.formEndpoint;
  pending = signal(false);
  error = signal('');
  reference = signal('');
  form = {
    name: '',
    email: '',
    company: '',
    service: this.route.snapshot.queryParamMap.get('service') || '',
    message: '',
    website: '',
    budget: '',
    timeline: '',
    phone: '',
    companyWebsite: '',
  };
  constructor() {
    const title =
      this.item?.title ||
      this.industry?.title ||
      (
        {
          home: 'Software, AI & Digital Growth',
          services: 'Our Services',
          industries: 'Industry Experience',
          work: 'Our Experience',
          about: 'About AniPriWeb',
          contact: 'Discuss Your Project',
          privacy: 'Privacy',
          notfound: 'Page Not Found',
        } as Record<string, string>
      )[this.kind];
    const description =
      this.item?.intro ||
      this.industry?.intro ||
      'Custom software, AI engineering, digital marketing and SEO. Around 10 years of experience across software development and digital services.';
    inject(Title).setTitle(title + ' | AniPriWeb');
    const meta = inject(Meta);
    meta.updateTag({ name: 'description', content: description });
    meta.updateTag({ property: 'og:title', content: title + ' | AniPriWeb' });
    meta.updateTag({ property: 'og:description', content: description });
    meta.updateTag({ property: 'og:type', content: 'website' });
    meta.updateTag({
      name: 'robots',
      content: this.kind === 'notfound' ? 'noindex' : 'index,follow',
    });
    let canonical = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.doc.createElement('link');
      canonical.rel = 'canonical';
      this.doc.head.appendChild(canonical);
    }
    const path = '/' + this.route.snapshot.url.map((s) => s.path).join('/');
    canonical.href = siteConfig.siteUrl + (path === '/' ? '/' : path);
    meta.updateTag({ property: 'og:url', content: canonical.href });
  }
  submit(f: NgForm) {
    if (this.pending() || this.reference()) return;
    if (f.invalid) {
      f.control.markAllAsTouched();
      return;
    }
    this.pending.set(true);
    this.error.set('');
    if (!this.formConfigured) {
      this.pending.set(false);
      this.error.set('Online inquiries are not available yet. Please check back shortly.');
      return;
    }
    const { companyWebsite, phone, ...details } = this.form;
    const payload = {
      ...details,
      name: details.name.trim(),
      email: details.email.trim(),
      _subject: 'AniPriWeb project inquiry',
      _gotcha: companyWebsite,
    };
    this.http
      .post(siteConfig.formEndpoint, payload, { headers: { Accept: 'application/json' } })
      .pipe(
        timeout(20000),
        finalize(() => this.pending.set(false)),
      )
      .subscribe({
        next: () => {
          this.reference.set('submitted');
          this.analytics.lead();
          if (isPlatformBrowser(this.platform))
            setTimeout(() => this.doc.getElementById('success')?.focus());
        },
        error: (response: HttpErrorResponse) => {
          const errors: unknown = response.error?.errors;
          const messages = Array.isArray(errors)
            ? errors
                .map((entry: unknown) => {
                  if (typeof entry !== 'object' || entry === null || !('message' in entry))
                    return '';
                  return typeof entry.message === 'string' ? entry.message.slice(0, 300) : '';
                })
                .filter(Boolean)
                .slice(0, 3)
            : [];
          this.error.set(
            messages.length
              ? messages.join(' ') +
                  ' Your details are still here; please correct the issue and try again.'
              : 'Your inquiry could not be sent or confirmed. Your details are still here. Please try again shortly.',
          );
        },
      });
  }
}
