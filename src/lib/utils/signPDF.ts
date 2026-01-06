import { PDFDocument, degrees, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

/**
 * Signs a PDF with a signature image at specific coordinates
 * @param pdfBytes - The original PDF as ArrayBuffer
 * @param signatureImage - The signature as a data URL
 * @param position - The position {x, y} to place the signature
 * @param scale - The scale factor for the signature
 * @param pageNumber - The page number (0-indexed) to place the signature
 * @returns Promise<ArrayBuffer> - The signed PDF as ArrayBuffer
 */
export async function signPDF(
  pdfBytes: ArrayBuffer,
  signatureImage: string, // Data URL
  position: { x: number; y: number },
  scale: number = 1,
  pageNumber: number = 0
): Promise<ArrayBuffer> {
  try {
    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Embed the signature image
    const signaturePng = await pdfDoc.embedPng(signatureImage);
    
    // Get the page where the signature will be placed
    const page = pdfDoc.getPage(pageNumber);
    
    // Get page dimensions to adjust coordinates
    const { width, height } = page.getSize();
    
    // Calculate scaled dimensions
    const scaledWidth = signaturePng.width * scale;
    const scaledHeight = signaturePng.height * scale;
    
    // Adjust coordinates based on PDF coordinate system (origin is bottom-left)
    const adjustedX = position.x;
    const adjustedY = height - position.y - scaledHeight;
    
    // Draw the signature on the page
    page.drawImage(signaturePng, {
      x: adjustedX,
      y: adjustedY,
      width: scaledWidth,
      height: scaledHeight,
      opacity: 1,
    });
    
    // Save the modified PDF
    const signedPdfBytes = await pdfDoc.save();
    
    return signedPdfBytes;
  } catch (error) {
    console.error('Error signing PDF:', error);
    throw error;
  }
}

/**
 * Downloads a PDF from ArrayBuffer
 * @param pdfBytes - The PDF as ArrayBuffer
 * @param filename - The name for the downloaded file
 */
export function downloadSignedPDF(pdfBytes: ArrayBuffer, filename: string = 'signed-document.pdf') {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, filename);
}

/**
 * Converts canvas coordinates to PDF coordinates
 * @param canvasPos - Position in canvas coordinates
 * @param canvasSize - Size of the canvas
 * @param pdfPageSize - Size of the PDF page
 * @returns PDF coordinates
 */
export function convertCoordsToPDF(
  canvasPos: { x: number; y: number },
  canvasSize: { width: number; height: number },
  pdfPageSize: { width: number; height: number }
): { x: number; y: number } {
  // Calculate ratios
  const xRatio = pdfPageSize.width / canvasSize.width;
  const yRatio = pdfPageSize.height / canvasSize.height;
  
  // Apply ratios to convert coordinates
  return {
    x: canvasPos.x * xRatio,
    y: canvasPos.y * yRatio
  };
}