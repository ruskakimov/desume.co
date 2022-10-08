import jsPDF from "jspdf";
import { Box } from "../common/box";
import { Coord } from "../common/types";

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
  maxWidth: number;
}

/**
 * A wrapper around a 3rd party PDF document object that prevents tight coupling to 3rd party code.
 */
export class PDF {
  static defaultColor: string = "#000000";
  private jsPdf: jsPDF;

  constructor() {
    this.jsPdf = new jsPDF({ format: "a4", unit: "pt" });
  }

  save() {
    this.jsPdf.save();
  }

  drawBox(box: Box) {
    this.jsPdf.rect(
      box.topLeft.x,
      box.topLeft.y,
      box.size.width,
      box.size.height
    );
  }

  drawLine(point1: Coord, point2: Coord, options?: LineOptions) {
    this.jsPdf
      .saveGraphicsState()
      .setDrawColor(options?.color ?? PDF.defaultColor)
      .line(point1.x, point1.y, point2.x, point2.y)
      .restoreGraphicsState();
  }

  drawText(baselineLeft: Coord, text: string, options: TextOptions) {
    // Draw baseline for testing purposes
    this.drawLine(
      baselineLeft,
      { x: baselineLeft.x + options.maxWidth, y: baselineLeft.y },
      { color: "#ff0000" }
    );

    this.jsPdf
      .setFont(options.fontFamily, options.fontStyle, options.fontWeight)
      .setFontSize(options.fontSizePt)
      .text(text, baselineLeft.x, baselineLeft.y, {
        maxWidth: options.maxWidth,
        lineHeightFactor: options.lineHeightPt / options.fontSizePt,
      });
  }
}
