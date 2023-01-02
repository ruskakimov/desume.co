import { Size } from "../interfaces/measure";

export type PageSizeName = "a4" | "us-letter";

/**
 * Reference: https://pdfkit.org/docs/paper_sizes.html
 */
export const pageSizes: Record<PageSizeName, Size> = {
  a4: {
    width: 595.28,
    height: 841.89,
  },
  "us-letter": {
    width: 612.0,
    height: 792.0,
  },
};
