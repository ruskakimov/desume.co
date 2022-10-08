import jsPDF from "jspdf";
import { Box } from "../common/box";
import { Coord } from "../common/types";

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
  private jsPdf: jsPDF;

  constructor() {
    this.jsPdf = new jsPDF({ format: "a4", unit: "pt" });
  }

  save() {
    this.jsPdf.save();
  }

  drawRect(box: Box) {
    this.jsPdf.rect(
      box.topLeft.x,
      box.topLeft.y,
      box.size.width,
      box.size.height
    );
  }

  drawText(baselineLeft: Coord, text: string, options: TextOptions) {
    // Draw baseline
    this.jsPdf.setDrawColor("#ff0000");
    this.jsPdf.line(
      baselineLeft.x,
      baselineLeft.y,
      baselineLeft.x + options.maxWidth,
      baselineLeft.y
    );
    this.jsPdf.setDrawColor("#000000");

    this.jsPdf
      .setFont(options.fontFamily, options.fontStyle, options.fontWeight)
      .setFontSize(options.fontSizePt)
      .text(text, baselineLeft.x, baselineLeft.y, {
        maxWidth: options.maxWidth,
        lineHeightFactor: options.lineHeightPt / options.fontSizePt,
      });
  }
}
