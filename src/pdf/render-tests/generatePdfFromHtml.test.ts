import { readFile } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { generatePdfFromHtml } from "../generatePdfFromHtml";

describe("generatePdfFromHtml correctly renders", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.addScriptTag({
      content: generatePdfFromHtml.toString(),
    });
  });

  afterAll(async () => {
    // await browser.close();
  });

  test("a single line of text", async () => {
    const htmlPath = path.join(__dirname, "./1-single-line-of-text/input.html");
    const html = await readFile(htmlPath, "utf-8");
    await page.setContent(html);
    // await page.setContent(`<body>${__dirname}</body>`);
    // const pdf = await page.evaluate(async () => {
    //   const container = document.getElementById("container");
    //   return (window as any)["generatePdfFromHtml"](container);
    // });
  });
});
