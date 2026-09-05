'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Save, Trash2, Library } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange: (dataUrl: string) => void;
  onPlaceSignature?: () => void;
  onSignatureLoadedFromLibrary?: () => void;
  isPlacingSignature?: boolean;
  pdfFile?: File | null;
  isLoading?: boolean;
}

interface SavedSignature {
  id: string;
  name: string;
  imageData: string;
  createdAt: string;
}

export function SignatureCanvasComponent({
  onSignatureChange,
  onPlaceSignature,
  onSignatureLoadedFromLibrary,
  isPlacingSignature = false,
  pdfFile = null,
  isLoading = false
}: SignatureCanvasProps) {
  const [signature, setSignature] = useState<string | null>(null);
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Load saved signatures from library
  const loadSavedSignatures = useCallback(async () => {
    setIsLoadingLibrary(true);
    try {
      const response = await fetch('/api/saved-signatures');
      if (response.ok) {
        const data = await response.json();
        setSavedSignatures(data.signatures);
      }
    } catch (error) {
      console.error('Error loading saved signatures:', error);
    } finally {
      setIsLoadingLibrary(false);
    }
  }, []);

  // Load signatures when component mounts
  useEffect(() => {
    loadSavedSignatures();
  }, [loadSavedSignatures]);

  // Save current signature to library
  const saveToLibrary = useCallback(async () => {
    if (!signature || !signatureName.trim()) {
      alert('Por favor, ingresa un nombre para la firma');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/saved-signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signatureName.trim(),
          imageData: signature,
        }),
      });

      if (response.ok) {
        await loadSavedSignatures();
        setSignatureName('');
        setSaveDialogOpen(false);
        toast.success('¡Firma guardada exitosamente! ✅');
      } else {
        throw new Error('Error saving signature');
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('Error al guardar la firma');
    } finally {
      setIsSaving(false);
    }
  }, [signature, signatureName, loadSavedSignatures]);

  // Load a signature from library
  const loadSignatureFromLibrary = useCallback((savedSignature: SavedSignature) => {
    setSignature(savedSignature.imageData);
    onSignatureChange(savedSignature.imageData);
    setLibraryDialogOpen(false);
    onSignatureLoadedFromLibrary?.();
  }, [onSignatureChange, onSignatureLoadedFromLibrary]);

  // Delete a signature from library
  const deleteFromLibrary = useCallback(async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta firma?')) {
      return;
    }

    try {
      const response = await fetch(`/api/saved-signatures/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadSavedSignatures();
      } else {
        throw new Error('Error deleting signature');
      }
    } catch (error) {
      console.error('Error deleting signature:', error);
      alert('Error al eliminar la firma');
    }
  }, [loadSavedSignatures]);

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
    <div className="w-full space-y-4">
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

          <div className="space-y-2">
            {/* Library and Save to Library buttons */}
            <div className="flex flex-wrap gap-2">
              <Dialog open={libraryDialogOpen} onOpenChange={setLibraryDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="flex-1 min-w-0">
                    <Library className="w-4 h-4 mr-2" />
                    Biblioteca
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Biblioteca de Firmas</DialogTitle>
                    <DialogDescription>
                      Selecciona una firma guardada o guarda la actual
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {isLoadingLibrary ? (
                      <p className="text-sm text-gray-500 text-center py-4">Cargando...</p>
                    ) : savedSignatures.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No tienes firmas guardadas aún
                      </p>
                    ) : (
                      savedSignatures.map((sig) => (
                        <div
                          key={sig.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => loadSignatureFromLibrary(sig)}
                        >
                          <img
                            src={sig.imageData}
                            alt={sig.name}
                            className="w-24 h-16 object-contain bg-white border rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{sig.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(sig.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFromLibrary(sig.id);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {signature && (
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="flex-1 min-w-0">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Guardar Firma</DialogTitle>
                      <DialogDescription>
                        Dale un nombre a esta firma para usarla después
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gray-50 border rounded-lg p-4 flex justify-center">
                        <img
                          src={signature}
                          alt="Preview"
                          className="max-w-[200px] h-auto"
                        />
                      </div>
                      <Input
                        placeholder="Ej: Firma Formal, Rúbrica, Iniciales"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveToLibrary();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={saveToLibrary}
                        disabled={isSaving || !signatureName.trim()}
                        className="w-full"
                      >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Canvas action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={clear} className="flex-1 min-w-0">
                Limpiar
              </Button>
              <Button
                type="button"
                onClick={download}
                className="flex-1 min-w-0"
                disabled={!signature}
              >
                Descargar
              </Button>
            </div>

            {/* Place signature button */}
            {onPlaceSignature && (
              <Button
                type="button"
                onClick={onPlaceSignature}
                className="w-full"
                variant={isPlacingSignature ? "default" : "outline"}
                disabled={!pdfFile || !signature || isLoading}
              >
                {isPlacingSignature ? 'Ocultar firma' : 'Colocar firma en PDF'}
              </Button>
            )}
          </div>

      {/* {signature && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Previsualización:</h4>
          <img
            src={signature}
            alt="Signature preview"
            className="border rounded bg-white p-2 max-w-xs"
          />
        </div>
      )} */}
    </div>
  );
}