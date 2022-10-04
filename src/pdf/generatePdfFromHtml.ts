import jsPDF from "jspdf";
import { Box } from "../common/box";
import { a4SizeInPoints } from "../common/constants/sizes";
import { Coord } from "../common/types";
import { getFontProperties } from "./fontProperties";
import { PDF } from "./types";

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
    renderBox(doc, cellBox);

    Array.from(cell.children).forEach((el) => {
      const elBox = pdfBoxOf(el);
      const styles = getComputedStyle(el);

      renderBox(doc, elBox);

      // We assume to only receive px values here
      const fontSizePx = parseFloat(styles.fontSize);
      const lineHeightPx = parseFloat(styles.lineHeight);
      const fontFamily = styles.fontFamily;
      const fontStyle = styles.fontStyle as FontStyle;
      const fontWeight = parseInt(styles.fontWeight);

      // TODO: Calc properties once per font
      const bRatio = getFontProperties(fontFamily).baselineRatio;
      const baselineTopOffsetPx =
        (lineHeightPx - fontSizePx) / 2 + bRatio * fontSizePx;

      const baselineLeft: Coord = {
        x: elBox.topLeft.x,
        y: elBox.topLeft.y + baselineTopOffsetPx * pdfScalar,
      };

      renderText(doc, baselineLeft, el.textContent ?? "", {
        fontSizePt: fontSizePx * pdfScalar,
        lineHeightPt: lineHeightPx * pdfScalar,
        fontFamily,
        fontStyle,
        fontWeight,
      });
    });
  });

  return new PDF(doc);
}

function boxFromDomRect({ x, y, width, height }: DOMRect): Box {
  return new Box(x, y, width, height);
}

function renderBox(doc: jsPDF, pdfBox: Box) {
  doc.rect(
    pdfBox.topLeft.x,
    pdfBox.topLeft.y,
    pdfBox.size.width,
    pdfBox.size.height
  );
}

type FontStyle = "normal" | "italic" | "oblique";

interface TextOptions {
  fontSizePt: number;
  lineHeightPt: number;
  fontFamily: string;
  fontStyle: FontStyle;
  fontWeight: number;
}

function renderText(
  doc: jsPDF,
  baselineLeft: Coord,
  text: string,
  options: TextOptions
) {
  doc
    .setFont(options.fontFamily, options.fontStyle, options.fontWeight)
    .setFontSize(options.fontSizePt)
    .text(text, baselineLeft.x, baselineLeft.y, {
      lineHeightFactor: options.lineHeightPt / options.fontSizePt,
    });
}
