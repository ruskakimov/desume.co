/**
 * Returns an array of DOMRects, where each represents a single line of text.
 */
export function textNodeLineRects(textNode: Text): DOMRect[] {
  const range = new Range();
  range.selectNode(textNode);
  const rects = Array.from(range.getClientRects());
  range.detach();
  return rects;
}

/**
 * Returns text content broken into lines that browser rendered.
 * Source: https://www.bennadel.com/blog/4310-detecting-rendered-line-breaks-in-a-text-node-in-javascript.htm
 */
export function textNodeByLines(textNode: Text): string[] {
  if (textNode.nodeType !== 3) {
    throw new Error("Lines can only be extracted from text nodes.");
  }

  const textContent = textNode.textContent ?? "";
  const range = document.createRange();
  const lines: string[][] = [];

  for (let i = 0; i < textContent.length; i++) {
    range.setStart(textNode, 0);
    range.setEnd(textNode, i + 1);

    const lineIndex = range.getClientRects().length - 1;

    // Start new line.
    if (!lines[lineIndex]) lines.push([]);

    lines[lineIndex].push(textContent[i]);
  }

  return lines.map((chars) => chars.join(""));
}
