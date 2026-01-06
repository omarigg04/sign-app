'use client';

import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function PDFViewer({ file, onFileChange }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      if (newFile.type === 'application/pdf') {
        onFileChange(newFile);
      } else {
        alert('Please select a PDF file.');
      }
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return numPages ? Math.min(Math.max(1, newPageNumber), numPages) : 1;
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visor de PDF</CardTitle>
        <CardDescription>
          {file ? 'Visualizando el PDF cargado' : 'Carga un PDF para comenzar'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleFileUploadClick}>
              {file ? 'Cambiar PDF' : 'Cargar PDF'}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            
            {file && (
              <>
                <Button type="button" onClick={zoomOut} disabled={scale <= 0.5}>
                  Zoom -
                </Button>
                <Button type="button" onClick={zoomIn} disabled={scale >= 3}>
                  Zoom +
                </Button>
                <span className="self-center text-sm">
                  Zoom: {Math.round(scale * 100)}%
                </span>
              </>
            )}
          </div>
          
          {file && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm mr-2">
                  Página: {pageNumber} de {numPages || '?' }
                </span>
                <Button
                  type="button"
                  onClick={previousPage}
                  disabled={pageNumber <= 1}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  onClick={nextPage}
                  disabled={numPages ? pageNumber >= numPages : true}
                  className="ml-2"
                >
                  Siguiente
                </Button>
              </div>
              
              <div className="text-sm">
                Archivo: {file.name}
              </div>
            </div>
          )}
          
          <div className="border rounded overflow-auto max-h-[600px] flex items-center justify-center bg-gray-100">
            {file ? (
              <div className="pdf-container" style={{ transform: `scale(${scale})` }}>
                <Document
                  file={URL.createObjectURL(file)}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading="Cargando PDF..."
                  error="Error al cargar el PDF"
                >
                  <Page 
                    pageNumber={pageNumber} 
                    width={800}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>Por favor carga un archivo PDF</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}