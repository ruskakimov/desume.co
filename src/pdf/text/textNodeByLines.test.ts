import puppeteer from "puppeteer";
import { textNodeByLines } from "./textNodeByLines";

describe("textNodeByLines", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.addScriptTag({
      content: textNodeByLines.toString(),
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  test("parses single line", async () => {
    await page.setContent(`<p id="target">Single line of text</p>`);

    const lines = await page.evaluate(async () => {
      const element = document.getElementById("target");
      const textNode = element?.childNodes[0];
      return (window as any)["textNodeByLines"](textNode);
    });
    expect(lines).toEqual(["Single line of text"]);
  });

  test("parses two lines", async () => {
    await page.setContent(`
      <p id="target" style="width: 100px; font-size: 16px; font-family: "times";">Lorem ipsum dolor sit amet</p>
    `);

    const lines = await page.evaluate(async () => {
      const element = document.getElementById("target");
      const textNode = element?.childNodes[0];
      return (window as any)["textNodeByLines"](textNode);
    });
    expect(lines).toEqual(["Lorem ipsum ", "dolor sit amet"]);
  });
});
