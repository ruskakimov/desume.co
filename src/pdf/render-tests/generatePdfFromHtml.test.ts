import { readFile } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

describe("generatePdfFromHtml correctly renders", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    // [IMPORTANT] Build PDF generation code before running this test.
    const bundlePath = path.join(__dirname, "./bundle/bundle.js");
    await page.addScriptTag({ path: bundlePath });
  });

  afterAll(async () => {
    await browser.close();
  });

  test("a single line of text", async () => {
    const htmlPath = path.join(__dirname, "./1-single-line-of-text/input.html");
    const html = await readFile(htmlPath, "utf-8");
    await page.setContent(html);

    await page.evaluate(async () => {
      const container = document.getElementById("container");
      return (window as any).generatePdfFromHtml(container).save();
    });

    // Waits for download to finish
    await new Promise((r) => setTimeout(r, 2000));
  });
});
