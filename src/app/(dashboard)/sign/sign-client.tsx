'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { SignatureCanvasComponent } from '@/components/signature/signature-canvas';
import { DraggableSignature } from '@/components/signature/draggable-signature';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signPDF, downloadSignedPDF } from '@/lib/utils/signPDF';
import { checkSignatureLimit, registerSignature } from '@/lib/utils/signatureLimits';
import { Upload, FileText } from 'lucide-react';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function SignPageClient() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [signatureScale, setSignatureScale] = useState(0.5);
  const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isPlacingSignature, setIsPlacingSignature] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [limitInfo, setLimitInfo] = useState<{ canSign: boolean; remaining: number; plan: string } | null>(null);
  const [pdfScale, setPdfScale] = useState(1); // Zoom level for PDF viewer

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset loading when pdfFile or signatureImage changes
  useEffect(() => {
    setIsLoading(false);
    setProgress(0);
  }, [pdfFile, signatureImage]);

  // Load limit info when component mounts
  useEffect(() => {
    const loadLimitInfo = async () => {
      try {
        const limitData = await checkSignatureLimit();
        setLimitInfo({
          canSign: limitData.canSign,
          remaining: limitData.remaining,
          plan: limitData.plan
        });
      } catch (error) {
        console.error('Error loading limit info:', error);
        // Set default values if limit check fails
        setLimitInfo({
          canSign: true,
          remaining: 1,
          plan: 'FREE'
        });
      }
    };

    loadLimitInfo();
  }, []);

  const onDocumentLoadSuccess = async ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);

    // Get PDF dimensions for coordinate conversion
    if (pdfFile) {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const { PDFDocument } = await import('pdf-lib');
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const firstPage = pdfDoc.getPage(0);
        const { width, height } = firstPage.getSize();
        setPdfDimensions({ width, height });
        console.log('PDF real dimensions:', { width, height });
      } catch (error) {
        console.error('Error getting PDF dimensions:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setIsPlacingSignature(false);
      } else {
        alert('Por favor selecciona un archivo PDF');
      }
    }
  };

  const handleSignatureChange = (dataUrl: string) => {
    setSignatureImage(dataUrl);
  };

  const handleSignaturePositionChange = (position: { x: number; y: number }) => {
    setSignaturePosition(position);
  };

  const handleSignatureScaleChange = (scale: number) => {
    setSignatureScale(scale);
  };

  const handlePlaceSignature = () => {
    if (!signatureImage) {
      alert('Por favor, crea una firma primero');
      return;
    }
    if (!pdfFile) {
      alert('Por favor, carga un PDF primero');
      return;
    }
    setIsPlacingSignature(!isPlacingSignature);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return numPages ? Math.min(Math.max(1, newPageNumber), numPages) : 1;
    });
  };

  const handleZoomIn = () => {
    setPdfScale(prev => Math.min(prev + 0.25, 3)); // Max 300%
  };

  const handleZoomOut = () => {
    setPdfScale(prev => Math.max(prev - 0.25, 0.5)); // Min 50%
  };

  const handleResetZoom = () => {
    setPdfScale(1); // Reset to 100%
  };

  const handleExportPDF = async () => {
    if (!pdfFile) {
      alert('Por favor, carga un PDF primero');
      return;
    }

    if (!signatureImage) {
      alert('Por favor, crea una firma primero');
      return;
    }

    // Try to check signature limit (optional - won't block export if it fails)
    try {
      const limitData = await checkSignatureLimit();
      setLimitInfo({
        canSign: limitData.canSign,
        remaining: limitData.remaining,
        plan: limitData.plan
      });

      if (!limitData.canSign) {
        const proceed = confirm(`Has alcanzado tu límite de firmas (${limitData.maxSignatures} por ${limitData.period}). ¿Deseas continuar de todas formas?`);
        if (!proceed) return;
      }
    } catch (error) {
      console.warn('Could not check signature limit (continuing anyway):', error);
      // Continue with export even if limit check fails
    }

    setIsLoading(true);
    setProgress(10);

    try {
      // Update progress during processing
      setProgress(30);

      // Read the PDF file as ArrayBuffer
      const pdfBytes = await pdfFile.arrayBuffer();
      setProgress(60);

      // Calculate the scale ratio between displayed PDF and actual PDF
      let adjustedPosition = signaturePosition;
      let adjustedSignatureSize = { width: 150 * signatureScale, height: 150 * signatureScale }; // Default

      // Get the actual displayed signature dimensions from the DOM
      const signatureElement = document.querySelector('[alt="Signature"]') as HTMLImageElement;
      let displayedWidth = 150 * signatureScale;
      let displayedHeight = 150 * signatureScale;

      if (signatureElement) {
        // Get the natural dimensions of the image
        const imgWidth = signatureElement.naturalWidth || 150;
        const imgHeight = signatureElement.naturalHeight || 150;
        const aspectRatio = imgHeight / imgWidth;

        // Calculate displayed dimensions (150px base width * scale * aspect ratio)
        displayedWidth = 150 * signatureScale;
        displayedHeight = displayedWidth * aspectRatio;

        console.log('Signature image info:', {
          naturalWidth: imgWidth,
          naturalHeight: imgHeight,
          aspectRatio,
          displayedWidth,
          displayedHeight,
          scale: signatureScale
        });
      }

      if (pdfDimensions && pdfContainerRef.current) {
        // Get the ACTUAL visible PDF dimensions from the canvas element
        const pdfCanvas = pdfContainerRef.current.querySelector('canvas');
        if (!pdfCanvas) {
          console.error('Canvas not found');
          return;
        }

        const canvasRect = pdfCanvas.getBoundingClientRect();
        const containerRect = pdfContainerRef.current.getBoundingClientRect();

        const actualDisplayedWidth = canvasRect.width;
        const actualDisplayedHeight = canvasRect.height;

        // Calculate offset between container and canvas (in case there's padding/margin)
        const offsetX = canvasRect.left - containerRect.left;
        const offsetY = canvasRect.top - containerRect.top;

        const scaleRatio = pdfDimensions.width / actualDisplayedWidth;

        // Convert position to PDF coordinates (adjust for any offset first)
        adjustedPosition = {
          x: (signaturePosition.x - offsetX) * scaleRatio,
          y: (signaturePosition.y - offsetY) * scaleRatio
        };

        // Convert signature size to PDF coordinates
        adjustedSignatureSize = {
          width: displayedWidth * scaleRatio,
          height: displayedHeight * scaleRatio
        };

        console.log('Position and size conversion:', {
          originalPosition: signaturePosition,
          adjustedPosition,
          displayedSize: { width: displayedWidth, height: displayedHeight },
          adjustedSize: adjustedSignatureSize,
          scaleRatio,
          actualDisplayedWidth,
          actualDisplayedHeight,
          offset: { x: offsetX, y: offsetY },
          canvasRect: { left: canvasRect.left, top: canvasRect.top, width: canvasRect.width, height: canvasRect.height },
          containerRect: { left: containerRect.left, top: containerRect.top, width: containerRect.width, height: containerRect.height },
          realPdfDimensions: pdfDimensions
        });
      }

      // Sign the PDF (100% client-side with pdf-lib)
      const signedPdfBytes = await signPDF(
        pdfBytes,
        signatureImage,
        adjustedPosition,
        adjustedSignatureSize,
        pageNumber - 1 // Convert to 0-indexed
      );

      setProgress(90);

      // Download the signed PDF
      downloadSignedPDF(signedPdfBytes, `signed-${pdfFile.name}`);

      setProgress(100);

      // Try to register the signature (optional - won't affect the export)
      try {
        await registerSignature(pdfFile.name);
        // Update the displayed limit info after successful registration
        const updatedLimitData = await checkSignatureLimit();
        setLimitInfo({
          canSign: updatedLimitData.canSign,
          remaining: updatedLimitData.remaining,
          plan: updatedLimitData.plan
        });
      } catch (registrationError) {
        console.warn('Could not register signature in database:', registrationError);
        // Export still succeeded - just couldn't track it in DB
      }

      // Reset loading after a short delay
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error signing PDF:', error);
      alert('Error al firmar el PDF: ' + (error as Error).message);
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Firmar PDF</h1>
          {limitInfo && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Plan: <span className="font-semibold">{limitInfo.plan}</span>
                <br />
                Firmas restantes: <span className="font-semibold">{limitInfo.remaining}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Upload PDF */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Cargar PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                {pdfFile ? 'Cambiar PDF' : 'Seleccionar PDF'}
              </Button>
              {pdfFile && (
                <div className="mt-3 p-3 bg-gray-50 rounded flex items-start gap-2">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {pdfFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {numPages ? `${numPages} página${numPages > 1 ? 's' : ''}` : 'Cargando...'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signature Canvas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Crear Firma</CardTitle>
            </CardHeader>
            <CardContent>
              <SignatureCanvasComponent onSignatureChange={handleSignatureChange} />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Firmar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handlePlaceSignature}
                className="w-full"
                variant={isPlacingSignature ? "default" : "outline"}
                disabled={!pdfFile || !signatureImage || isLoading}
              >
                {isPlacingSignature ? 'Ocultar firma' : 'Colocar firma en PDF'}
              </Button>

              <Button
                onClick={handleExportPDF}
                className="w-full"
                disabled={!pdfFile || !signatureImage || isLoading || (limitInfo ? !limitInfo.canSign : false)}
              >
                {isLoading ? `Exportando... ${progress}%` : 'Exportar PDF firmado'}
              </Button>

              {isLoading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content - PDF Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {pdfFile ? pdfFile.name : 'Vista previa del PDF'}
              </h2>
              {numPages && (
                <p className="text-sm text-gray-600">
                  Página {pageNumber} de {numPages}
                </p>
              )}
            </div>
            {pdfFile && (
              <div className="flex items-center gap-4">
                {/* Zoom controls */}
                <div className="flex items-center gap-2 border-r pr-4">
                  <Button
                    onClick={handleZoomOut}
                    disabled={pdfScale <= 0.5}
                    variant="outline"
                    size="sm"
                    title="Reducir zoom"
                  >
                    -
                  </Button>
                  <span className="text-sm font-medium min-w-[4rem] text-center">
                    {Math.round(pdfScale * 100)}%
                  </span>
                  <Button
                    onClick={handleZoomIn}
                    disabled={pdfScale >= 3}
                    variant="outline"
                    size="sm"
                    title="Aumentar zoom"
                  >
                    +
                  </Button>
                  <Button
                    onClick={handleResetZoom}
                    variant="outline"
                    size="sm"
                    title="Restablecer zoom"
                  >
                    100%
                  </Button>
                </div>

                {/* Page navigation */}
                {numPages && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => changePage(-1)}
                      disabled={pageNumber <= 1}
                      variant="outline"
                      size="sm"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={() => changePage(1)}
                      disabled={pageNumber >= numPages}
                      variant="outline"
                      size="sm"
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className="min-h-full flex items-start justify-center">
            {pdfFile ? (
              <div className="relative inline-block" ref={pdfContainerRef}>
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="shadow-2xl"
                >
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={Math.min(window.innerWidth - 500, 1000) * pdfScale}
                  />
                </Document>

              {/* Draggable Signature Overlay */}
              {isPlacingSignature && signatureImage && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="pointer-events-auto">
                    <DraggableSignature
                      signatureImage={signatureImage}
                      position={signaturePosition}
                      onPositionChange={handleSignaturePositionChange}
                      scale={signatureScale}
                      onScaleChange={handleSignatureScaleChange}
                      onPage={pageNumber}
                      onDragEnd={() => {}}
                    />
                  </div>
                </div>
              )}
              </div>
            ) : (
              <div className="text-center p-12 text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay PDF cargado</p>
                <p className="text-sm">Selecciona un PDF desde el sidebar para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
