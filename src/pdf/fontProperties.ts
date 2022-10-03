export interface FontProperties {
  /**
   * Default line-height factor when CSS value is set to `normal`.
   */
  normalLineHeightFactor: number;

  /**
   * Distance from the top of the em square to the baseline,
   * if em square side (or font-size) equals 1.
   */
  baselineRatio: number;
}

export function getFontProperties(fontFamily: string): FontProperties {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "baseline";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";

  const h1 = document.createElement("h1");
  h1.appendChild(document.createTextNode("T"));
  h1.style.fontFamily = fontFamily;
  h1.style.margin = "0";
  h1.style.fontSize = "1000px";
  h1.style.lineHeight = "1";

  const base = document.createElement("span");
  base.style.display = "inline-block";
  base.style.height = "10px";
  base.style.width = "500px";
  base.style.backgroundColor = "red";
  base.style.marginLeft = "-500px";

  container.appendChild(h1);
  container.appendChild(base);

  // Append to DOM (to inflate the elements)
  document.body.appendChild(container);

  const h1Rect = h1.getBoundingClientRect();
  const baseRect = base.getBoundingClientRect();
  const baselineRatio = (baseRect.bottom - h1Rect.top) / h1Rect.height;

  // Clean-up DOM
  container.remove();

  return {
    normalLineHeightFactor: 1,
    baselineRatio,
  };
}
