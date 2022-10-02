import jsPDF from "jspdf";
import { a4SizeInPoints } from "../common/constants/sizes";
import { PDF } from "./types";

/**
 * Generates a single-page PDF document from an HTML element.
 */
export function generatePdfFromHtml(pageElement: HTMLElement): PDF {
  const doc = new jsPDF({ format: "a4", unit: "pt" });

  const rootRect = pageElement.getBoundingClientRect();
  const scalar = a4SizeInPoints.width / rootRect.width;
  const cells = Array.from(pageElement.children);

  cells.forEach((cell) => {
    const elements = Array.from(cell.children);

    elements.forEach((el) => {
      const { top, left, bottom, right, width, height } =
        el.getBoundingClientRect();

      const x = (left - rootRect.left) * scalar;
      const yTop = (top - rootRect.top) * scalar;

      // We assume to only receive px values here
      const fontSizePx = parseFloat(
        getComputedStyle(el).getPropertyValue("font-size")
      );

      doc.rect(x, yTop, width, height);
      doc
        .setFontSize(fontSizePx * scalar)
        .text(el.textContent ?? "", x, yTop, { baseline: "top" });
    });
  });

  return new PDF(doc);
}
