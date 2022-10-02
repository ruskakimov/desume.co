import jsPDF from "jspdf";
import { Box } from "../common/box";
import { a4SizeInPoints } from "../common/constants/sizes";
import { PDF } from "./types";

function boxFromDomRect({ x, y, width, height }: DOMRect): Box {
  return new Box(x, y, width, height);
}

/**
 * Generates a single-page PDF document from an HTML element.
 */
export function generatePdfFromHtml(pageElement: HTMLElement): PDF {
  const doc = new jsPDF({ format: "a4", unit: "pt" });

  const pageBox = boxFromDomRect(pageElement.getBoundingClientRect());
  const pdfScalar = a4SizeInPoints.width / pageBox.size.width;

  const cells = Array.from(pageElement.children);

  cells.forEach((cell) => {
    const elements = Array.from(cell.children);

    elements.forEach((el) => {
      const pdfBox = boxFromDomRect(el.getBoundingClientRect())
        .relativeTo(pageBox)
        .scaleBy(pdfScalar);

      // We assume to only receive px values here
      const fontSizePx = parseFloat(
        getComputedStyle(el).getPropertyValue("font-size")
      );

      const { x, y } = pdfBox.topLeft;
      const { width, height } = pdfBox.size;

      doc
        .rect(x, y, width, height)
        .setFontSize(fontSizePx * pdfScalar)
        .text(el.textContent ?? "", x, y, { baseline: "top" });
    });
  });

  return new PDF(doc);
}
