import puppeteer from "puppeteer";
import { FontProperties, getFontProperties } from "./fontProperties";

describe("getFontProperties", () => {
  test("calculates Arial properties", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.addScriptTag({
      content: getFontProperties.toString(),
    });

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
