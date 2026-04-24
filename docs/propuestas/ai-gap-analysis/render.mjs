import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const playwrightModuleUrl = pathToFileURL(
  "/Users/aritzjl/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js",
).href;
const playwright = (await import(playwrightModuleUrl)).default;
const { chromium } = playwright;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proposalFolder = process.argv[2] ?? "garantic";
const proposalDir = path.join(__dirname, proposalFolder);
const htmlPath = path.join(proposalDir, "propuesta.html");
const pdfPath = path.join(proposalDir, "propuesta.pdf");
const pngPath = path.join(proposalDir, "propuesta.png");

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

try {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 1980 },
    deviceScaleFactor: 2,
  });

  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    printBackground: true,
    preferCSSPageSize: true,
  });
  await page.screenshot({
    path: pngPath,
    fullPage: true,
  });

  console.log(pdfPath);
  console.log(pngPath);
} finally {
  await browser.close();
}
