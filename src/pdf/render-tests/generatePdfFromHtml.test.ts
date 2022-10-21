import { readFile } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import gm from "gm";

describe("generatePdfFromHtml correctly renders", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: path.join(__dirname, "./downloads"),
    });

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
      return (window as any).generatePdfFromHtml(container).save("1.pdf");
    });

    // Waits for download to finish
    await new Promise((r) => setTimeout(r, 1000));

    // gm convert -density 300 expected.pdf expected.png
    // gm convert -density 300 1.pdf 1.png

    gm(path.join(__dirname, "./downloads/1.pdf"))
      .command("convert")
      .in("-density", "300") // DPI
      .write(path.join(__dirname, "./downloads/output.png"), (err) => {
        // TODO: Promisify
        console.log(err);
      });

    // TODO: Remove once promisified
    await new Promise((r) => setTimeout(r, 3000));
  });
});
