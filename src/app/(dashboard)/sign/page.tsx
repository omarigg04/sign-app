'use client';

import { useState, useRef, useEffect } from 'react';
import { PDFViewer } from '@/components/pdf/pdf-viewer';
import { SignatureCanvasComponent } from '@/components/signature/signature-canvas';
import { DraggableSignature } from '@/components/signature/draggable-signature';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { signPDF, downloadSignedPDF } from '@/lib/utils/signPDF';
import { checkSignatureLimit, registerSignature } from '@/lib/utils/signatureLimits';

export default function SignPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 100, y: 100 });
  const [signatureScale, setSignatureScale] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [isPlacingSignature, setIsPlacingSignature] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [limitInfo, setLimitInfo] = useState<{ canSign: boolean; remaining: number; plan: string } | null>(null);

  const pdfContainerRef = useRef<HTMLDivElement>(null);

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

  const handleSignatureChange = (dataUrl: string) => {
    setSignatureImage(dataUrl);
  };

  const handlePdfFileChange = (file: File | null) => {
    setPdfFile(file);
  };

  const handleSignaturePositionChange = (position: { x: number; y: number }) => {
    setSignaturePosition(position);
  };

  const handleSignatureScaleChange = (scale: number) => {
    setSignatureScale(scale);
  };

  const handleDragEnd = () => {
    setIsPlacingSignature(false);
  };

  const handlePlaceSignature = () => {
    if (!signatureImage) {
      alert('Por favor, crea una firma primero');
      return;
    }
    setIsPlacingSignature(true);
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

    // Check signature limit before proceeding
    try {
      const limitData = await checkSignatureLimit();
      setLimitInfo({
        canSign: limitData.canSign,
        remaining: limitData.remaining,
        plan: limitData.plan
      });

      if (!limitData.canSign) {
        alert(`Has alcanzado tu límite de firmas. Plan: ${limitData.plan}. Máximo: ${limitData.maxSignatures} por ${limitData.period}.`);
        return;
      }
    } catch (error) {
      console.error('Error checking signature limit:', error);
      alert('Error verificando el límite de firmas. Por favor intenta de nuevo.');
      return;
    }

    setIsLoading(true);
    setProgress(10); // Start with 10% progress

    try {
      // Update progress during processing
      setProgress(30);

      // Read the PDF file as ArrayBuffer
      const pdfBytes = await pdfFile.arrayBuffer();
      setProgress(60);

      // Sign the PDF
      const signedPdfBytes = await signPDF(
        pdfBytes,
        signatureImage,
        signaturePosition,
        signatureScale,
        activePage // For now, using active page (0-indexed)
      );

      setProgress(90);

      // Download the signed PDF
      downloadSignedPDF(signedPdfBytes, `signed-${pdfFile.name}`);

      // Register the signature in the database
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
        console.error('Error registering signature:', registrationError);
        // Still allow the download even if registration fails
      }

      setProgress(100);

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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Firmar PDF</h1>

      {limitInfo && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            Plan: <span className="font-semibold">{limitInfo.plan}</span> |
            Firmas restantes: <span className="font-semibold">{limitInfo.remaining}</span>
          </p>
          {!limitInfo.canSign && (
            <p className="text-red-600 mt-2">
              Has alcanzado tu límite de firmas para este período.
              <a href="/upgrade" className="text-blue-600 underline ml-1">Mejora tu plan</a> para más firmas.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload PDF Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">1. Cargar PDF</h2>
              <PDFViewer file={pdfFile} onFileChange={handlePdfFileChange} />
            </CardContent>
          </Card>
        </div>

        {/* Signature Canvas Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">2. Crear Firma</h2>
              <SignatureCanvasComponent onSignatureChange={handleSignatureChange} />
            </CardContent>
          </Card>
        </div>

        {/* PDF Viewer with Signature Placement Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">3. Firmar PDF</h2>

              <div className="space-y-4">
                {pdfFile && signatureImage ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={handlePlaceSignature}
                        disabled={isPlacingSignature || isLoading || (limitInfo ? !limitInfo.canSign : false)}
                      >
                        {isPlacingSignature ? 'Soltar firma' : 'Colocar firma'}
                      </Button>
                      <Button
                        onClick={handleExportPDF}
                        variant="default"
                        disabled={isLoading || (limitInfo ? !limitInfo.canSign : false)}
                      >
                        {isLoading ? 'Firmando...' : 'Exportar PDF firmado'}
                      </Button>
                    </div>

                    {isLoading && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">Progreso: {progress}%</p>
                      </div>
                    )}

                    <div
                      ref={pdfContainerRef}
                      className="relative border rounded bg-gray-100 overflow-auto max-h-[500px]"
                    >
                      {/* We'll render the PDF viewer here with signature overlay */}
                      <div className="p-4 text-center text-gray-500">
                        Vista previa del PDF con firma (la versión real se descargará al hacer clic en "Exportar PDF firmado")
                      </div>

                      {/* Signature overlay when placing */}
                      {isPlacingSignature && signatureImage && (
                        <DraggableSignature
                          signatureImage={signatureImage}
                          position={signaturePosition}
                          onPositionChange={handleSignaturePositionChange}
                          scale={signatureScale}
                          onScaleChange={handleSignatureScaleChange}
                          onPage={activePage}
                          onDragEnd={handleDragEnd}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    {pdfFile ? (
                      <p>Por favor, crea una firma para continuar</p>
                    ) : (
                      <p>Por favor, carga un PDF y crea una firma para continuar</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}