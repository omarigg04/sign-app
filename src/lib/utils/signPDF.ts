import { PDFDocument, degrees, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

/**
 * Signs a PDF with a signature image at specific coordinates
 * @param pdfBytes - The original PDF as ArrayBuffer
 * @param signatureImage - The signature as a data URL
 * @param position - The position {x, y} to place the signature (in PDF coordinates)
 * @param signatureSize - Width and height of the signature as it should appear in PDF (in PDF points)
 * @param pageNumber - The page number (0-indexed) to place the signature
 * @returns Promise<Uint8Array> - The signed PDF as Uint8Array
 */
export async function signPDF(
  pdfBytes: ArrayBuffer,
  signatureImage: string, // Data URL
  position: { x: number; y: number },
  signatureSize: { width: number; height: number }, // Size of signature in PDF points
  pageNumber: number = 0
): Promise<Uint8Array> {
  try {
    console.log('Starting PDF signing process...', { position, signatureSize, pageNumber });

    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the page where the signature will be placed
    const page = pdfDoc.getPage(pageNumber);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    console.log('PDF page dimensions:', { pageWidth, pageHeight });

    // Embed the signature image (detect if PNG or JPEG)
    let embeddedImage;
    if (signatureImage.includes('image/png')) {
      embeddedImage = await pdfDoc.embedPng(signatureImage);
    } else if (signatureImage.includes('image/jpeg') || signatureImage.includes('image/jpg')) {
      embeddedImage = await pdfDoc.embedJpg(signatureImage);
    } else {
      // Default to PNG
      embeddedImage = await pdfDoc.embedPng(signatureImage);
    }

    console.log('Signature image embedded:', {
      originalWidth: embeddedImage.width,
      originalHeight: embeddedImage.height
    });

    // Use the size directly from the UI (already scaled and converted)
    const finalWidth = signatureSize.width;
    const finalHeight = signatureSize.height;

    console.log('Final signature dimensions:', { finalWidth, finalHeight });

    // PDF coordinate system has origin at bottom-left
    // Our position from the UI is top-left, so we need to convert
    const pdfX = position.x;
    const pdfY = pageHeight - position.y - finalHeight;

    console.log('Final position:', { pdfX, pdfY });

    // Draw the signature on the page
    page.drawImage(embeddedImage, {
      x: pdfX,
      y: pdfY,
      width: finalWidth,
      height: finalHeight,
      opacity: 1,
    });

    console.log('Signature drawn successfully');

    // Save the modified PDF
    const signedPdfBytes = await pdfDoc.save();

    console.log('PDF saved successfully');

    return signedPdfBytes;
  } catch (error) {
    console.error('Error signing PDF:', error);
    throw error;
  }
}

/**
 * Downloads a PDF from Uint8Array
 * @param pdfBytes - The PDF as Uint8Array
 * @param filename - The name for the downloaded file
 */
export function downloadSignedPDF(pdfBytes: Uint8Array, filename: string = 'signed-document.pdf') {
  // Create a new Uint8Array to ensure compatibility
  const buffer = new Uint8Array(pdfBytes);
  const blob = new Blob([buffer], { type: 'application/pdf' });
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