import jsPDF from "jspdf";
import { Box } from "../common/box";
import { a4SizeInPoints } from "../common/constants/sizes";
import { Coord } from "../common/types";
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
      const fontSizePx = parseFloat(styles.getPropertyValue("font-size"));
      const fontFamily = styles.getPropertyValue("font-family");
      const fontStyle = styles.getPropertyValue("font-style") as FontStyle;
      const fontWeight = parseInt(styles.getPropertyValue("font-weight"));
      const lineHeight = parseFloat(styles.getPropertyValue("line-height"));

      renderText(doc, elBox.topLeft, el.textContent ?? "", {
        fontSizePt: fontSizePx * pdfScalar,
        lineHeightPt: lineHeight * pdfScalar,
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
  topLeft: Coord,
  text: string,
  options: TextOptions
) {
  // TODO: Baseline(top) doesn't work with custom line-height value
  // Either: pass baselineY here (need to know ascender/descender ratio)
  // Or: find a work-around
  // Or: submit a PR patch
  // Or: choose another library that doesn't have this flaw (but also supports char distance)
  doc
    .setFont(options.fontFamily, options.fontStyle, options.fontWeight)
    .setFontSize(options.fontSizePt)
    .text(text, topLeft.x, topLeft.y, {
      lineHeightFactor: options.lineHeightPt / options.fontSizePt,
    });
}
