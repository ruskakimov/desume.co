import jsPDF from "jspdf";
import { Box } from "../common/classes/Box";
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

  save(filename?: string) {
    this.jsPdf.save(filename);
  }

  drawBox(box: Box): PDF {
    this.jsPdf.rect(
      box.topLeft.x,
      box.topLeft.y,
      box.size.width,
      box.size.height
    );
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
        lineHeightFactor: options.lineHeightPt / options.fontSizePt,
      })
      .restoreGraphicsState();
    return this;
  }
}
