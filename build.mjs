// Builds the installable app into dist/: bundles React + icons, compiles Tailwind,
// renders the PNG icons, writes the manifest and the offline service worker.
import { build } from "esbuild";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const out = "dist";
const id = Date.now().toString(36);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "icons"), { recursive: true });

// 1. JavaScript (and the font CSS it imports)
await build({
  entryPoints: { app: "src/main.jsx" },
  bundle: true,
  minify: true,
  outdir: out,
  format: "iife",
  target: ["es2019", "safari13"],
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".woff2": "file", ".woff": "file" },
  assetNames: "fonts/[name]-[hash]",
  legalComments: "none"
});
// esbuild writes the imported font CSS as dist/app.css; keep it as fonts.css
fs.renameSync(path.join(out, "app.css"), path.join(out, "fonts.css"));

// 2. Tailwind + page styles, with the fonts prepended
execSync(`npx tailwindcss -i src/styles.css -o ${out}/tw.css --minify`, { stdio: "inherit" });
fs.writeFileSync(path.join(out, "app.css"),
  fs.readFileSync(path.join(out, "fonts.css"), "utf8") + "\n" + fs.readFileSync(path.join(out, "tw.css"), "utf8"));
fs.rmSync(path.join(out, "fonts.css"));
fs.rmSync(path.join(out, "tw.css"));

// 3. Icons
const svg = fs.readFileSync("src/icon.svg", "utf8");
fs.writeFileSync(path.join(out, "icons/icon.svg"), svg);
const png = (size, file) =>
  fs.writeFileSync(path.join(out, "icons", file), new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng());
png(512, "icon-512.png");
png(192, "icon-192.png");
png(180, "apple-touch-icon.png");
png(32, "favicon-32.png");

// 4. Manifest
fs.writeFileSync(path.join(out, "manifest.webmanifest"), JSON.stringify({
  name: "Our Love Journey",
  short_name: "Our Love",
  description: "A keepsake for Cynthia: our quiz, reasons, love notes and milestones.",
  start_url: "./",
  scope: "./",
  display: "standalone",
  orientation: "portrait",
  background_color: "#fbf1ef",
  theme_color: "#fbf1ef",
  icons: [
    { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
}, null, 2));

// 5. Page
fs.writeFileSync(path.join(out, "index.html"), fs.readFileSync("src/index.html", "utf8").replaceAll("__BUILD__", id));
fs.writeFileSync(path.join(out, ".nojekyll"), "");

// 6. Service worker: precache everything except the Latin-Extended woff fallbacks
const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else files.push(path.relative(out, p).split(path.sep).join("/"));
  }
})(out);
const precache = ["./", `app.css?v=${id}`, `app.js?v=${id}`,
  ...files.filter(f => !/^(index\.html|app\.css|app\.js|\.nojekyll)$/.test(f) && !f.endsWith(".woff"))];
fs.writeFileSync(path.join(out, "sw.js"),
  fs.readFileSync("src/sw.js", "utf8").replace("__BUILD__", id).replace("__PRECACHE__", JSON.stringify(precache, null, 2)));

console.log(`Built ${id}:`, files.length + 1, "files");
