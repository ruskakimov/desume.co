import puppeteer from "puppeteer";
import { FontProperties, getFontProperties } from "./fontProperties";

describe("getFontProperties", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.addScriptTag({
      content: getFontProperties.toString(),
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  test("calculates Arial properties", async () => {
    const arialFontProperties: FontProperties = {
      normalLineHeightFactor: 1.15,
      baselineRatio: 0.8465,
    };
    const calcProperties = await page.evaluate(async () => {
      return (window as any)["getFontProperties"]("Arial");
    });
    expect(calcProperties).toEqual(arialFontProperties);
  });

  test("calculates Times properties", async () => {
    const timesFontProperties: FontProperties = {
      normalLineHeightFactor: 1.15,
      baselineRatio: 0.825,
    };
    const calcProperties = await page.evaluate(async () => {
      return (window as any)["getFontProperties"]("Times");
    });
    expect(calcProperties).toEqual(timesFontProperties);
  });
});
