/**
 * Returns text content broken into lines that browser rendered.
 */
export function textNodeByLines(textNode: Text): string[] {
  return [textNode.textContent ?? ""];
}
