import { Box } from "../common/box";
import { a4SizeInPoints } from "../common/constants/sizes";
import { Coord } from "../common/types";
import { getFontProperties } from "./fontProperties";
import { FontStyle, PDF } from "./pdf";

/**
 * Generates a single-page PDF document from an HTML element.
 */
export function generatePdfFromHtml(pageElement: HTMLElement): PDF {
  const doc = new PDF();

  const pageBox = boxFromDomRect(pageElement.getBoundingClientRect());
  const pdfScalar = a4SizeInPoints.width / pageBox.size.width;

  const pdfBoxOf = (element: Element) => {
    return boxFromDomRect(element.getBoundingClientRect())
      .relativeTo(pageBox)
      .scaledBy(pdfScalar);
  };

  function renderElement(el: Element) {
    if (el.children.length === 0) {
      if (el.nodeName === "LI") {
        renderMarker(el);
      }
      renderTextElement(el);
      return;
    }

    Array.from(el.children).forEach((child) => {
      renderElement(child);
    });
  }

  function renderMarker(li: Element) {
    const styles = getComputedStyle(li, "::marker");
    const markerBox = pdfBoxOf(li).translatedBy(-parseFloat(styles.width), 0);

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
      x: markerBox.topLeft.x,
      y: markerBox.topLeft.y + baselineTopOffsetPx * pdfScalar,
    };

    doc.drawText(baselineLeft, styles.content.slice(1, -1) ?? "", {
      fontSizePt: fontSizePx * pdfScalar,
      lineHeightPt: lineHeightPx * pdfScalar,
      fontFamily,
      fontStyle,
      fontWeight,
      maxWidth: markerBox.size.width,
    });
  }

  function renderTextElement(el: Element) {
    const elBox = pdfBoxOf(el);
    const styles = getComputedStyle(el);

    doc.drawRect(elBox);

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

    doc.drawText(baselineLeft, el.textContent ?? "", {
      fontSizePt: fontSizePx * pdfScalar,
      lineHeightPt: lineHeightPx * pdfScalar,
      fontFamily,
      fontStyle,
      fontWeight,
      maxWidth: elBox.size.width,
    });
  }

  Array.from(pageElement.children).forEach((cell) => {
    const cellBox = pdfBoxOf(cell);
    doc.drawRect(cellBox);

    Array.from(cell.children).forEach((el) => renderElement(el));
  });

  return doc;
}

function boxFromDomRect({ x, y, width, height }: DOMRect): Box {
  return new Box(x, y, width, height);
}
