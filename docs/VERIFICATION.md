# Verification and handoff

- Production Angular build: passed; 19 prerendered routes (18 public sitemap pages plus 404).
- Prerender checks: page headings, descriptions, canonical links, sitemap coverage.
- Browser checks: desktop 1440px, mobile 390px, menu open/close, internal navigation, direct page access, selected service carried into the contact form, no horizontal overflow, no JavaScript errors.
- GitHub Pages `/anipriweb/` subpath: build and browser navigation passed.
- Form behavior: mocked provider rejection preserved inputs; mocked acceptance showed success and emitted exactly one lead event. No real inquiry was transmitted.
- Analytics: no script before consent; opt-in loaded the script; withdrawal persisted; lead event contained no email or message. Third-party script was intercepted during testing.

## Remaining launch configuration

GitHub access is connected. The website is uploaded to `website/business-platform` and proposed in pull request #1: https://github.com/Animesh1310/anipriweb/pull/1. The live website remains unchanged while the work stays on its separate branch.

Configure a verified Formspree recipient/endpoint, the GitHub Pages source, the intended domain/base path, and optional GA4 ID as documented in README.md. Then run a real email delivery test. Confirm final business contact/privacy details before launch.

Screenshots illustrate the implemented design; interfaces in the homepage are explicitly labeled concepts.

