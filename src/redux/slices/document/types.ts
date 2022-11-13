/**
 * Page side margins as fractions of page width/height.
 */
export interface PageMargins {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type DocumentComponent = HeadingComponent;

export interface HeadingComponent {
  text: string;
}
