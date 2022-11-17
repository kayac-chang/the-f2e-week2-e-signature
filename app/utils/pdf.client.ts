import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { range } from "ramda";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

export function toDocument(url: string | ArrayBuffer) {
  return getDocument(url).promise;
}

export function getAllPagesFromDocument(
  document: PDFDocumentProxy
): Promise<PDFPageProxy[]> {
  return Promise.all(
    range(1, document.numPages).map(document.getPage.bind(document))
  );
}
