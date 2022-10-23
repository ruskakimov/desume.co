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
    const matches = await outputMatchesExpected("1-single-line-of-text", page);
    expect(matches).toEqual(true);
  });

  test("multiple lines of text", async () => {
    const matches = await outputMatchesExpected(
      "2-multiple-lines-of-text",
      page
    );
    expect(matches).toEqual(true);
  });
});

async function outputMatchesExpected(
  testFolderName: string,
  page: puppeteer.Page
): Promise<boolean> {
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

  return areImagesEqual(
    path.join(testCaseFolder, "./output.png"),
    path.join(testCaseFolder, "./expected.png")
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

function areImagesEqual(
  image1Path: string,
  image2Path: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    gm.compare(
      image1Path,
      image2Path,
      0, // error tolerance
      (err, isEqual, meanSquaredError, rawOutput) => {
        if (err) reject(err);
        else resolve(isEqual);
      }
    );
  });
}
