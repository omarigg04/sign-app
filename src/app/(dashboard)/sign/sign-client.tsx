'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Image from 'next/image';
import Link from 'next/link';
import { SignatureCanvasComponent } from '@/components/signature/signature-canvas';
import { DraggableSignature } from '@/components/signature/draggable-signature';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signPDF, downloadSignedPDF } from '@/lib/utils/signPDF';
import { checkSignatureLimit, registerSignature } from '@/lib/utils/signatureLimits';
import { Upload, FileText, Sparkles, FileSignature, CheckCircle2 } from 'lucide-react';

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
  const [mobileTab, setMobileTab] = useState<'prepare' | 'preview'>('prepare'); // Tab state for mobile

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

    // Auto-switch to preview tab on mobile when placing signature
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (!isPlacingSignature) { // If we're about to show the signature
        setMobileTab('preview');
      }
    }
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

    // On mobile, switch to preview tab so the PDF canvas is rendered and we can get accurate measurements
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (isMobile && mobileTab !== 'preview') {
      setMobileTab('preview');
      // Wait a bit for the DOM to update and canvas to render
      await new Promise(resolve => setTimeout(resolve, 300));
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
          console.error('Canvas not found, using fallback calculations');
          // Fallback: use a reasonable default calculation
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
          const estimatedDisplayedWidth = isMobile
            ? Math.min(window.innerWidth - 40, 800) * pdfScale
            : Math.min(window.innerWidth - 500, 1000) * pdfScale;

          const scaleRatio = pdfDimensions.width / estimatedDisplayedWidth;

          adjustedPosition = {
            x: signaturePosition.x * scaleRatio,
            y: signaturePosition.y * scaleRatio
          };

          adjustedSignatureSize = {
            width: displayedWidth * scaleRatio,
            height: displayedHeight * scaleRatio
          };

          console.log('Using fallback calculations:', {
            originalPosition: signaturePosition,
            adjustedPosition,
            displayedSize: { width: displayedWidth, height: displayedHeight },
            adjustedSize: adjustedSignatureSize,
            scaleRatio,
            estimatedDisplayedWidth,
            pdfDimensions,
            isMobile
          });
        } else {
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
      } else {
        console.warn('pdfDimensions or pdfContainerRef not available, using default values');
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
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Mobile Tabs - Only visible on mobile */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="flex">
          <button
            onClick={() => setMobileTab('prepare')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${mobileTab === 'prepare'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50/30'
              }`}
          >
            Preparar
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${mobileTab === 'preview'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50/30'
              }`}
          >
            Vista Previa
          </button>
        </div>
      </div>

      {/* Sidebar - Always visible on desktop, conditionally on mobile */}
      <aside className={`${mobileTab === 'prepare' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[420px] border-r border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-xl flex-col overflow-y-auto`}>
        {/* Logo y Plan Info */}
        <div className="p-6 border-b border-gray-200/50">
          <Link href="/" className="block mb-6">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={150}
              height={50}
              className="h-12 w-auto cursor-pointer hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </Link>

          {/* Plan Badge */}
          {limitInfo && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Plan:</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                  <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
                  <span className="text-sm font-bold text-white">{limitInfo.plan}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm text-gray-600">Firmas restantes:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {limitInfo.remaining}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Cargar PDF */}
        <div className="p-6 border-b border-gray-200/50 space-y-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Cargar PDF</h3>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            variant="outline"
            className="w-full border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group bg-transparent"
          >
            <Upload className="h-5 w-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-gray-900">{pdfFile ? 'Cambiar PDF' : 'Seleccionar PDF'}</span>
          </Button>

          {pdfFile && (
            <div className="p-3 rounded-xl bg-white/50 border border-gray-200 flex items-start gap-2 animate-fade-in">
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
        </div>

        {/* Step 2: Crear Firma */}
        <div className="p-6 border-b border-gray-200/50 space-y-4 flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Crear Firma</h3>
          </div>

          <SignatureCanvasComponent
            onSignatureChange={handleSignatureChange}
            onPlaceSignature={handlePlaceSignature}
            isPlacingSignature={isPlacingSignature}
            pdfFile={pdfFile}
            isLoading={isLoading}
          />
        </div>

        {/* Step 3: Firmar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block p-6 space-y-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Firmar</h3>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed px-2">Colocar firma en PDF</p>

          <Button
            size="lg"
            onClick={handleExportPDF}
            className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
            disabled={!pdfFile || !signatureImage || isLoading || (limitInfo ? !limitInfo.canSign : false)}
          >
            <FileSignature className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            {isLoading ? `Exportando... ${progress}%` : 'Exportar PDF firmado'}
          </Button>

          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/30"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-right">{progress}%</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content - PDF Viewer - Always visible on desktop, conditionally on mobile */}
      <main className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                {pdfFile ? pdfFile.name : 'Vista previa del PDF'}
              </h2>
              {numPages && (
                <p className="text-sm text-gray-600 mt-1">
                  Página {pageNumber} de {numPages}
                </p>
              )}
            </div>
            {pdfFile && (
              <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
                {/* Zoom controls */}
                <div className="flex items-center gap-1 lg:gap-2 lg:border-r lg:pr-4">
                  <Button
                    onClick={handleZoomOut}
                    disabled={pdfScale <= 0.5}
                    variant="outline"
                    size="sm"
                    title="Reducir zoom"
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="text-xs lg:text-sm font-medium min-w-[3rem] lg:min-w-[4rem] text-center">
                    {Math.round(pdfScale * 100)}%
                  </span>
                  <Button
                    onClick={handleZoomIn}
                    disabled={pdfScale >= 3}
                    variant="outline"
                    size="sm"
                    title="Aumentar zoom"
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                  <Button
                    onClick={handleResetZoom}
                    variant="outline"
                    size="sm"
                    title="Restablecer zoom"
                    className="hidden lg:inline-flex"
                  >
                    100%
                  </Button>
                </div>

                {/* Page navigation */}
                {numPages && numPages > 1 && (
                  <div className="flex items-center gap-1 lg:gap-2">
                    <Button
                      onClick={() => changePage(-1)}
                      disabled={pageNumber <= 1}
                      variant="outline"
                      size="sm"
                      className="text-xs lg:text-sm"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={() => changePage(1)}
                      disabled={pageNumber >= numPages}
                      variant="outline"
                      size="sm"
                      className="text-xs lg:text-sm"
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 p-3 lg:p-6">
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
                    width={
                      typeof window !== 'undefined'
                        ? window.innerWidth < 1024
                          ? Math.min(window.innerWidth - 40, 800) * pdfScale // Mobile: full width minus padding
                          : Math.min(window.innerWidth - 500, 1000) * pdfScale // Desktop: account for sidebar (420px + padding/borders)
                        : 800 * pdfScale
                    }
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
                        onDragEnd={() => { }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="max-w-md w-full border-0 bg-white/80 backdrop-blur-sm shadow-lg p-12 text-center animate-fade-in">
                <div className="mb-6 flex justify-center">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">No hay PDF cargado</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  <span className="lg:hidden">Ve a "Preparar" para seleccionar un PDF y comenzar</span>
                  <span className="hidden lg:inline">Selecciona un PDF desde el sidebar para comenzar</span>
                </p>

                <div className="flex flex-col gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Carga tu documento</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Crea o selecciona tu firma</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Descarga tu PDF firmado</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Actions - Visible on mobile only, below PDF preview */}
          <div className="lg:hidden p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
            <div className="space-y-3">
              <Button
                onClick={handleExportPDF}
                size="lg"
                className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                disabled={!pdfFile || !signatureImage || isLoading || (limitInfo ? !limitInfo.canSign : false)}
              >
                <FileSignature className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                {isLoading ? `Exportando... ${progress}%` : 'Exportar PDF firmado'}
              </Button>

              {isLoading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/30"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-right">{progress}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
