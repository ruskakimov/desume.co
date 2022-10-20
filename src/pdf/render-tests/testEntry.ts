import { generatePdfFromHtml } from "../generatePdfFromHtml";

// Exposes the function to puppeteer.
(window as any).generatePdfFromHtml = generatePdfFromHtml;
