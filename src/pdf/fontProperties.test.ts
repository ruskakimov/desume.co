import puppeteer from "puppeteer";
import { FontProperties, getFontProperties } from "./fontProperties";

describe("getFontProperties", () => {
  let page: puppeteer.Page;

  beforeAll(async () => {
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.addScriptTag({
      content: getFontProperties.toString(),
    });
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
});
