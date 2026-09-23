# AniPriWeb website

Angular 21, TypeScript and SCSS. All public routes are prerendered to static HTML for GitHub Pages. No Node, C#, database or paid cloud server is needed in production.

## Local development

Requires Node 24 and npm.

```sh
cd web
npm ci
npm start
```

The form remains visibly unavailable until a real Formspree endpoint is configured. No submission is simulated. UI previews work without a form account.

## Contact form setup

1. Create a form at https://formspree.io and verify the receiving business email.
2. Set the GitHub repository variable `CONTACT_FORM_ENDPOINT` to `https://formspree.io/f/YOUR_FORM_ID`.
3. In Formspree, enable appropriate domain restrictions, spam controls and notifications. Confirm current plan limits. Set an acknowledgment email there if wanted.
4. Submit a real test inquiry after deployment and verify it arrives. This requires the owner's account; a valid endpoint cannot be invented.

For local testing:

```sh
CONTACT_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID node scripts/configure-site.mjs
cd web && npm start
```

The public endpoint is not a secret. Never put a provider API secret into frontend code. Inquiries are sent directly from the browser to Formspree, which manages receipt/storage. No exposed inquiry database or admin route is included.

## GitHub Pages

The workflow builds pull requests and deploys only main. In Settings → Pages, choose GitHub Actions as the source. Review and merge the website pull request when ready.

Repository variables for the standard repository URL:

- `SITE_URL`: `https://Animesh1310.github.io/anipriweb`
- `SITE_BASE_HREF`: `/anipriweb/`
- `CONTACT_FORM_ENDPOINT`: the verified form endpoint

For the custom domain `anipriweb.com`:

- Set `SITE_URL` to `https://anipriweb.com`
- Set `SITE_BASE_HREF` to `/`
- Configure/verify the domain in Pages and set DNS according to GitHub's displayed instructions. Inspect existing DNS and hosting before changing it.

The GitHub Actions deployment uploads only `web/dist/web/browser`. Legacy root HTML files are retained for reference and are not in the new deployment artifact. The generated `404.html` supports an actual not-found page. Published route folders contain HTML, so direct links work without an application server. Assets use the configured base path.

## Production build and verification

```sh
node scripts/configure-site.mjs
cd web
npm run build
cd ..
node scripts/check-build.mjs
```

## Content and design

- `web/src/app/content.ts`: services and industry content.
- `web/src/app/page.html`: page layouts and inquiry form.
- `web/src/styles.scss`: responsive design system.
- `web/src/app/site-config.ts`: build-generated public settings.
- `web/public/sitemap.xml`: search sitemap; update when adding routes.

Experience is described as approximately ten years across software and digital services, not ten years of each AI offering. Industry pages are honest experience summaries, not invented client case studies. Concept interfaces are labeled. No fabricated testimonials, client logos, metrics, addresses or contact details.

## Launch checklist

- Confirm final brand and content, service scope, domain, and publishable project material.
- Connect and test Formspree; confirm privacy notice, retention and account access for your business before receiving real inquiries.
- Configure Pages and domain variables; run workflow; check HTTPS and a direct nested page URL.
- Register the deployed domain in Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`.
- Optional GA4: set `GA_MEASUREMENT_ID` to your `G-...` ID. The consent prompt appears only when configured; no analytics loads before acceptance. Decline remains available in footer preferences. The `generate_lead` event fires only after Formspree accepts the request and contains no inquiry details. Register that event as a key event in your GA4 account. Verify consent behavior and disable enhanced-measurement form interactions in GA4; do not enable collection of user-provided data. Clarity is not installed.
- No chatbot is simulated. A real assistant would require its own server-side integration, approved knowledge and operational monitoring.
