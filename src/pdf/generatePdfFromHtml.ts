import { Box } from "../common/box";
import { a4SizeInPoints } from "../common/constants/sizes";
import { Coord } from "../common/types";
import { getFontProperties } from "./text/fontProperties";
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

  function renderNode(node: Node) {
    if (node.childNodes.length === 0) {
      if (node instanceof Text) {
        renderTextNode(node);
      }
      return;
    }
    Array.from(node.childNodes).forEach((child) => {
      renderNode(child);
    });
  }

  function renderTextNode(text: Text) {
    const el = text.parentElement!;
    const elBox = pdfBoxOf(el);
    const styles = window.getComputedStyle(el);

    const textOptions: TextOptions = {
      fontSizePt: parseFloat(styles.fontSize) * pdfScalar,
      lineHeightPt: parseFloat(styles.lineHeight) * pdfScalar,
      fontFamily: styles.fontFamily,
      fontStyle: styles.fontStyle as FontStyle,
      fontWeight: parseInt(styles.fontWeight),
    };

    // TODO: Calc properties once per font
    const bRatio = getFontProperties(textOptions.fontFamily).baselineRatio;
    const baselineTopOffsetPt =
      (textOptions.lineHeightPt - textOptions.fontSizePt) / 2 +
      bRatio * textOptions.fontSizePt;

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
        textOptions
      );
  }

  Array.from(pageElement.children).forEach((cell) => {
    const cellBox = pdfBoxOf(cell);
    doc.drawBox(cellBox);

    Array.from(cell.children).forEach((el) => renderNode(el));
  });

  return doc;
}

function boxFromDomRect({ x, y, width, height }: DOMRect): Box {
  return new Box(x, y, width, height);
}
