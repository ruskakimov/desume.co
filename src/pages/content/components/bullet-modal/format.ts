export function fixFormat(text: string) {
  const trimmed = text.trim();
  if (trimmed.length === 0) return trimmed;

  return addDotAtEndIfMissing(capitalizeFirstLetter(removeDoubleSpace(text)));
}

function capitalizeFirstLetter(text: string): string {
  return text[0].toLocaleUpperCase() + text.slice(1);
}

function addDotAtEndIfMissing(text: string): string {
  if (text.at(-1) === ".") return text;
  return text + ".";
}

function removeDoubleSpace(text: string): string {
  return text
    .split(" ")
    .filter((x) => x !== "")
    .join(" ");
}
