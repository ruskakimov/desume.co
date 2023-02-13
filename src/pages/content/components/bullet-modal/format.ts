export function fixFormat(text: string) {
  [
    removeNewLines,
    removeExtraWhiteSpace,
    capitalizeFirstLetter,
    addDotAtEndIfMissing,
  ].forEach((operation) => (text = operation(text)));
  return text;
}

function capitalizeFirstLetter(text: string): string {
  if (text.length === 0) return text;
  return text[0].toLocaleUpperCase() + text.slice(1);
}

function addDotAtEndIfMissing(text: string): string {
  if (text.length === 0) return text;
  if (text.at(-1) === ".") return text;
  return text + ".";
}

function removeExtraWhiteSpace(text: string): string {
  return text.trim().replaceAll(/\s+/g, " ");
}

function removeNewLines(text: string): string {
  return text.replaceAll(/\n/g, "");
}
