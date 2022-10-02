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

  const pdfBoxOf = (element: Element) => {
    return boxFromDomRect(element.getBoundingClientRect())
      .relativeTo(pageBox)
      .scaleBy(pdfScalar);
  };

  Array.from(pageElement.children).forEach((cell) => {
    const cellBox = pdfBoxOf(cell);

    doc.rect(
      cellBox.topLeft.x,
      cellBox.topLeft.y,
      cellBox.size.width,
      cellBox.size.height
    );

    Array.from(cell.children).forEach((el) => {
      const pdfBox = pdfBoxOf(el);

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
