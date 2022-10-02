import jsPDF from "jspdf";

/**
 * A wrapper around a 3rd party PDF document object that prevents tight coupling to 3rd party code.
 */
export class PDF {
  constructor(private jsPdf: jsPDF) {}

  save() {
    this.jsPdf.save();
  }
}
