import { readFileSync, existsSync } from "node:fs";
const output = new URL("../web/dist/web/browser", import.meta.url).pathname;
const sitemap = readFileSync(output + "/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const base = urls[0].replace(/\/$/, "");
for (const url of urls) {
  const route = url.slice(base.length).replace(/^\//, "");
  const file = output + "/" + (route ? route + "/" : "") + "index.html";
  if (!existsSync(file)) throw Error("Missing page: " + file);
  const html = readFileSync(file, "utf8");
  if (
    !/<h1[ >]/.test(html) ||
    !html.includes('rel="canonical"') ||
    !html.includes('name="description"')
  )
    throw Error("Missing SEO content: " + file);
  if (html.includes("Your app is running"))
    throw Error("Scaffold content remains");
}
console.log(
  `Verified ${urls.length} prerendered pages, headings, descriptions and canonical links.`,
);
