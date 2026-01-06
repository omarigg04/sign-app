'use client';

import { useState, useRef, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SignatureCanvasProps {
  onSignatureChange: (dataUrl: string) => void;
}

export function SignatureCanvasComponent({ onSignatureChange }: SignatureCanvasProps) {
  const [signature, setSignature] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = useCallback(() => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignature(null);
      onSignatureChange('');
    }
  }, [onSignatureChange]);

  const save = useCallback(() => {
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      alert('Please draw a signature first.');
      return;
    }

    if (sigCanvas.current) {
      const dataUrl = sigCanvas.current.toDataURL('image/png');
      setSignature(dataUrl);
      onSignatureChange(dataUrl);
    }
  }, [onSignatureChange]);

  const download = useCallback(() => {
    if (signature) {
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = signature;
      link.click();
    }
  }, [signature]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Firmar Aquí</CardTitle>
        <CardDescription>Dibuja tu firma en el espacio a continuación</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ 
                className: 'w-full h-64 bg-white',
                style: { touchAction: 'none' } 
              }}
              onEnd={() => save()}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={clear}>
              Limpiar
            </Button>
            <Button type="button" onClick={save}>
              Guardar Firma
            </Button>
            {signature && (
              <Button type="button" variant="secondary" onClick={download}>
                Descargar
              </Button>
            )}
          </div>
          
          {signature && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Previsualización:</h4>
              <img 
                src={signature} 
                alt="Signature preview" 
                className="border rounded bg-white p-2 max-w-xs"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}