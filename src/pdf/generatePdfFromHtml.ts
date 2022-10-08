import { Box } from "../common/box";
import { a4SizeInPoints } from "../common/constants/sizes";
import { Coord } from "../common/types";
import { getFontProperties } from "./fontProperties";
import { FontStyle, PDF, TextOptions } from "./pdf";

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

    doc.drawText(
      styles.content.slice(1, -1) ?? "",
      baselineLeft,
      markerBox.size.width,
      {
        fontSizePt: fontSizePx * pdfScalar,
        lineHeightPt: lineHeightPx * pdfScalar,
        fontFamily,
        fontStyle,
        fontWeight,
      }
    );
  }

  function renderTextElement(el: Element) {
    const elBox = pdfBoxOf(el);
    const textProps = getTextProperties(el, pdfScalar);

    // TODO: Calc properties once per font
    const bRatio = getFontProperties(textProps.fontFamily).baselineRatio;
    const baselineTopOffsetPt =
      (textProps.lineHeightPt - textProps.fontSizePt) / 2 +
      bRatio * textProps.fontSizePt;

    const baselineLeft: Coord = {
      x: elBox.topLeft.x,
      y: elBox.topLeft.y + baselineTopOffsetPt,
    };
    const baselineRight: Coord = {
      x: baselineLeft.x + elBox.size.width,
      y: baselineLeft.y,
    };

    doc
      .drawBox(elBox)
      .drawLine(baselineLeft, baselineRight, { color: "#ff0000" })
      .drawText(
        el.textContent ?? "",
        baselineLeft,
        elBox.size.width,
        textProps
      );
  }

  Array.from(pageElement.children).forEach((cell) => {
    const cellBox = pdfBoxOf(cell);
    doc.drawBox(cellBox);

    Array.from(cell.children).forEach((el) => renderElement(el));
  });

  return doc;
}

function boxFromDomRect({ x, y, width, height }: DOMRect): Box {
  return new Box(x, y, width, height);
}

function getTextProperties(
  textElement: Element,
  pdfScalar: number
): TextOptions {
  const styles = getComputedStyle(textElement);

  return {
    fontSizePt: parseFloat(styles.fontSize) * pdfScalar,
    lineHeightPt: parseFloat(styles.lineHeight) * pdfScalar,
    fontFamily: styles.fontFamily,
    fontStyle: styles.fontStyle as FontStyle,
    fontWeight: parseInt(styles.fontWeight),
  };
}
