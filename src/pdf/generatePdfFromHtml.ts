import { Box } from "../common/classes/box";
import { PageSizeName, pageSizes } from "../common/constants/page-sizes";
import { Coord } from "../common/interfaces/measure";
import { getFontProperties } from "./text/fontProperties";
import { FontStyle, PDF, TextOptions } from "./pdf";
import { textNodeByLines, textNodeLineRects } from "./text/textNodeUtils";

import charterRegularPath from "../assets/fonts/Charter/Charter-Regular.ttf";
import charterItalicPath from "../assets/fonts/Charter/Charter-Italic.ttf";
import charterBoldPath from "../assets/fonts/Charter/Charter-Bold.ttf";
import charterBoldItalicPath from "../assets/fonts/Charter/Charter-Bold-Italic.ttf";

export const rectMarkerClass = "render-this-rect";

/**
 * Generates a single-page PDF document from an HTML element.
 */
export function generatePdfFromHtml(
  pageElement: HTMLElement,
  pageSize: PageSizeName = "a4"
): PDF {
  const { width, height } = pageSizes[pageSize];
  const doc = new PDF(width, height);

  doc.loadFont(charterRegularPath, "Charter", "normal", 400);
  doc.loadFont(charterItalicPath, "Charter", "italic", 400);
  doc.loadFont(charterBoldPath, "Charter", "normal", 700);
  doc.loadFont(charterBoldItalicPath, "Charter", "italic", 700);

  const pageBox = boxFromDomRect(pageElement.getBoundingClientRect());
  const pdfScalar = width / pageBox.size.width;

  const pdfBoxFromDomRect = (domRect: DOMRect) => {
    return boxFromDomRect(domRect)
      .relativeTo(pageBox)
      .scaleCoordinateSystemBy(pdfScalar);
  };

  function renderNode(node: Node) {
    if (node.childNodes.length === 0) {
      if (node instanceof Text) {
        renderTextNode(node);
      } else if (
        node instanceof HTMLElement &&
        node.classList.contains(rectMarkerClass)
      ) {
        renderRect(node);
      }
      return;
    }
    Array.from(node.childNodes).forEach((child) => {
      renderNode(child);
    });
  }

  function renderRect(element: HTMLElement) {
    const elBox = pdfBoxFromDomRect(element.getBoundingClientRect());
    const styles = window.getComputedStyle(element);
    doc.drawBox(elBox, {
      paintStyle: "fill",
      fillColor: styles.backgroundColor,
    });
  }

  function renderTextNode(text: Text) {
    const el = text.parentElement!;
    const elBox = pdfBoxFromDomRect(el.getBoundingClientRect());
    const styles = window.getComputedStyle(el);

    // doc.drawBox(elBox);

    const textOptions: TextOptions = {
      fontSizePt: parseFloat(styles.fontSize) * pdfScalar,
      lineHeightPt: parseFloat(styles.lineHeight) * pdfScalar,
      fontFamily: styles.fontFamily.split(",")[0],
      fontStyle: styles.fontStyle as FontStyle,
      fontWeight: parseInt(styles.fontWeight),
      letterSpacing: parseFloat(styles.letterSpacing) * pdfScalar,
    };

    // TODO: Calc properties once per font
    const bRatio = getFontProperties(textOptions.fontFamily).baselineRatio;

    const lineStrings = textNodeByLines(text);
    const lineBoxes = textNodeLineRects(text).map(pdfBoxFromDomRect);

    lineBoxes.forEach((lineBox, i) => {
      const baselineTopOffsetPt =
        (lineBox.size.height - textOptions.fontSizePt) / 2 +
        bRatio * textOptions.fontSizePt;

      const baselineLeft: Coord = {
        x: lineBox.topLeft.x,
        y: lineBox.topLeft.y + baselineTopOffsetPt,
      };
      const baselineRight: Coord = {
        x: baselineLeft.x + lineBox.size.width,
        y: baselineLeft.y,
      };

      doc
        // .drawBox(lineBox)
        // .drawLine(baselineLeft, baselineRight, { color: "#00ff00" })
        .drawText(lineStrings[i] ?? "", baselineLeft, textOptions);
    });
  }

  renderNode(pageElement);
  return doc;
}

function boxFromDomRect({ x, y, width, height }: DOMRect): Box {
  return new Box(x, y, width, height);
}
