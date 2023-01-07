import jsPDF from "jspdf";
import { Box } from "../common/classes/box";
import { Coord } from "../common/interfaces/measure";

export interface LineOptions {
  color?: string;
}

export type FontStyle = "normal" | "italic" | "oblique";

export interface TextOptions {
  fontSizePt: number;
  lineHeightPt: number;
  fontFamily: string;
  fontStyle: FontStyle;
  fontWeight: number;
  letterSpacing: number;
}

export interface ReactOptions {
  paintStyle: "stroke" | "fill";
  fillColor: string;
}

/**
 * A wrapper around a 3rd party PDF document object that prevents tight coupling to 3rd party code.
 */
export class PDF {
  static defaultColor: string = "#000000";
  private jsPdf: jsPDF;

  constructor(private pageWidth: number, private pageHeight: number) {
    this.jsPdf = new jsPDF({
      format: [pageWidth, pageHeight],
      unit: "pt",
      putOnlyUsedFonts: true,
    });
  }

  /**
   * Appends a new page and transfers the focus of drawing operations to it.
   */
  nextPage() {
    this.jsPdf.addPage([this.pageWidth, this.pageHeight], "portrait");
  }

  /**
   * jsPDF only supports a subset of TTF fonts. (Source: https://github.com/parallax/jsPDF/issues/2921#issuecomment-696563669)
   *
   * Source code references:
   * - https://github.com/parallax/jsPDF/issues/2921#issue-706056673
   * - https://github.com/parallax/jsPDF/issues/3002#issue-742917585
   */
  loadFont(
    fontPath: string,
    familyName: string,
    fontStyle: FontStyle,
    fontWeight: number
  ) {
    this.jsPdf.addFont(fontPath, familyName, fontStyle, fontWeight);
  }

  save(filename?: string) {
    this.jsPdf.save(filename);
  }

  drawBox(box: Box, options?: ReactOptions): PDF {
    this.jsPdf
      .saveGraphicsState()
      .setFillColor(options?.fillColor ?? PDF.defaultColor)
      .rect(
        box.topLeft.x,
        box.topLeft.y,
        box.size.width,
        box.size.height,
        options?.paintStyle === "fill" ? "F" : "S"
      )
      .restoreGraphicsState();
    return this;
  }

  drawLine(point1: Coord, point2: Coord, options?: LineOptions): PDF {
    this.jsPdf
      .saveGraphicsState()
      .setDrawColor(options?.color ?? PDF.defaultColor)
      .line(point1.x, point1.y, point2.x, point2.y)
      .restoreGraphicsState();
    return this;
  }

  drawText(text: string, baselineLeft: Coord, options: TextOptions): PDF {
    this.jsPdf
      .saveGraphicsState()
      .setFont(options.fontFamily, options.fontStyle, options.fontWeight)
      .setFontSize(options.fontSizePt)
      .text(text, baselineLeft.x, baselineLeft.y, {
        charSpace: options.letterSpacing,
        lineHeightFactor: options.lineHeightPt / options.fontSizePt,
      })
      .restoreGraphicsState();
    return this;
  }
}
