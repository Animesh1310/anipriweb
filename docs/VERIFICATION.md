# Verification and handoff

- Production Angular build: passed; 19 prerendered routes (18 public sitemap pages plus 404).
- Prerender checks: page headings, descriptions, canonical links, sitemap coverage.
- Browser checks: desktop 1440px, mobile 390px, menu open/close, internal navigation, direct page access, selected service carried into the contact form, no horizontal overflow, no JavaScript errors.
- GitHub Pages `/anipriweb/` subpath: build and browser navigation passed.
- Form behavior: mocked provider rejection preserved inputs; mocked acceptance showed success and emitted exactly one lead event. No real inquiry was transmitted.
- Analytics: no script before consent; opt-in loaded the script; withdrawal persisted; lead event contained no email or message. Third-party script was intercepted during testing.

## Remaining launch configuration

GitHub access is connected. The website is uploaded to `website/business-platform` and proposed in pull request #1: https://github.com/Animesh1310/anipriweb/pull/1. The live website remains unchanged while the work stays on its separate branch.

The supplied Formspree endpoint `https://formspree.io/f/xgavywrq` is connected in source and as the build-time default. JSON submissions preserve the tailored inquiry fields and honeypot; provider errors retain the entered details, and requests have a 20-second timeout. No automatic retries are used, to avoid duplicate inquiries.

Configure the GitHub Pages source, intended domain/base path, and optional GA4 ID as documented in README.md. Verify the Formspree recipient and run a real email delivery test after deployment. Confirm final business contact/privacy details before launch.

Screenshots illustrate the implemented design; interfaces in the homepage are explicitly labeled concepts.
