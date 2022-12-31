import { readFile } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import gm from "gm";

describe("generatePdfFromHtml correctly renders", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
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
    const diff = await outputAndExpectedDiff("1-single-line-of-text", page);
    expect(diff).toBeLessThan(0.01);
  });

  test("multiple lines of text", async () => {
    const diff = await outputAndExpectedDiff("2-multiple-lines-of-text", page);
    expect(diff).toBeLessThan(0.01);
  });

  test("rich text", async () => {
    const diff = await outputAndExpectedDiff("3-rich-text", page);
    expect(diff).toBeLessThan(0.01);
  });

  test("with scaled container", async () => {
    const diff = await outputAndExpectedDiff("4-scaled-container", page);
    expect(diff).toBeLessThan(0.01);
  });
});

async function outputAndExpectedDiff(
  testFolderName: string,
  page: puppeteer.Page
): Promise<number> {
  const testCaseFolder = path.join(__dirname, testFolderName);
  const htmlPath = path.join(testCaseFolder, "./input.html");
  const html = await readFile(htmlPath, "utf-8");
  await page.setContent(html);

  await page.evaluate(async (testFolderName) => {
    const container = document.getElementById("container");
    return (window as any)
      .generatePdfFromHtml(container)
      .save(`${testFolderName}.pdf`);
  }, testFolderName);

  // Waits for download to finish
  await new Promise((r) => setTimeout(r, 1000));

  await pdfToPng(
    path.join(__dirname, `./downloads/${testFolderName}.pdf`),
    path.join(testCaseFolder, "./output.png")
  );

  return imageDiff(
    path.join(testCaseFolder, "./output.png"),
    path.join(testCaseFolder, "./expected.png"),
    path.join(testCaseFolder, "./diff.png")
  );
}

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

function imageDiff(
  image1Path: string,
  image2Path: string,
  diffPath: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    gm.compare(
      image1Path,
      image2Path,
      {
        file: diffPath,
        highlightStyle: "Tint",
        tolerance: 0,
      },
      (err, isEqual, meanSquaredError, rawOutput) => {
        if (err) reject(err);
        else resolve(meanSquaredError);
      }
    );
  });
}
