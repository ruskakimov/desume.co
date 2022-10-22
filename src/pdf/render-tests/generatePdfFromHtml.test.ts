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
    const testCaseFolder = path.join(__dirname, "./1-single-line-of-text");
    const htmlPath = path.join(testCaseFolder, "./input.html");
    const html = await readFile(htmlPath, "utf-8");
    await page.setContent(html);

    await page.evaluate(async () => {
      const container = document.getElementById("container");
      return (window as any).generatePdfFromHtml(container).save("1.pdf");
    });

    // Waits for download to finish
    await new Promise((r) => setTimeout(r, 1000));

    await pdfToPng(
      path.join(__dirname, "./downloads/1.pdf"),
      path.join(testCaseFolder, "./output.png")
    );

    const areEqual = await areImagesEqual(
      path.join(testCaseFolder, "./output.png"),
      path.join(testCaseFolder, "./expected.png")
    );

    expect(areEqual).toEqual(true);
  });
});

function pdfToPng(pdfPath: string, pngPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    gm(pdfPath)
      .command("convert")
      .in("-density", "300") // DPI
      .write(pngPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
  });
}

function areImagesEqual(
  image1Path: string,
  image2Path: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    gm.compare(
      image1Path,
      image2Path,
      0, // tolerance
      (err, isEqual, meanSquaredError, rawOutput) => {
        if (err) reject(err);
        else resolve(isEqual);
      }
    );
  });
}
