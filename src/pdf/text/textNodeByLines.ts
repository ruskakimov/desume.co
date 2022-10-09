export function textNodeByLines(textNode: Text): string[] {
  return [textNode.textContent ?? ""];
}
