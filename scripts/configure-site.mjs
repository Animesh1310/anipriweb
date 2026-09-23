import { writeFileSync, readFileSync } from "node:fs";
const siteUrl = (process.env.SITE_URL || "https://anipriweb.com").replace(
  /\/$/,
  "",
);
const analyticsId = process.env.GA_MEASUREMENT_ID || "";
if (analyticsId && !/^G-[A-Z0-9]+$/.test(analyticsId))
  throw Error("Invalid GA4 measurement ID");
// This public form URL is not an API secret. A repository variable can override it.
const formEndpoint =
  process.env.CONTACT_FORM_ENDPOINT || "https://formspree.io/f/xgavywrq";
if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/[a-zA-Z0-9_/-]+)?$/i.test(siteUrl))
  throw Error("SITE_URL must be an HTTPS URL without query or fragment");
if (
  formEndpoint &&
  !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(formEndpoint)
)
  throw Error("Use a Formspree form endpoint: https://formspree.io/f/FORM_ID");
writeFileSync(
  "web/src/app/site-config.ts",
  "export const siteConfig = " +
    JSON.stringify({ siteUrl, formEndpoint, analyticsId }) +
    ";\n",
);
const sourceSitemap = readFileSync("web/public/sitemap.xml", "utf8");
const previousUrl = sourceSitemap.match(/<loc>(.*?)<\/loc>/)?.[1];
if (!previousUrl) throw Error("Sitemap has no base URL");
let sitemap = sourceSitemap.replaceAll(previousUrl.replace(/\/$/, ""), siteUrl);
writeFileSync("web/public/sitemap.xml", sitemap);
writeFileSync(
  "web/public/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
let index = readFileSync("web/src/index.html", "utf8").replace(
  previousUrl.replace(/\/$/, ""),
  siteUrl,
);
writeFileSync("web/src/index.html", index);
console.log(
  "Site configured; contact form " +
    (formEndpoint ? "enabled" : "not configured"),
);
