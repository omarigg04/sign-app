'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface DraggableSignatureProps {
  signatureImage: string | null;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  onPage: number;
  onDragEnd?: () => void;
}

export function DraggableSignature({
  signatureImage,
  position,
  onPositionChange,
  scale,
  onScaleChange,
  onPage,
  onDragEnd
}: DraggableSignatureProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const signatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !signatureRef.current) return;

      const containerRect = signatureRef.current.parentElement?.getBoundingClientRect();
      if (!containerRect) return;

      const newX = e.clientX - containerRect.left - dragOffset.x;
      const newY = e.clientY - containerRect.top - dragOffset.y;

      // Keep signature within bounds
      const boundedX = Math.max(0, Math.min(newX, containerRect.width - signatureRef.current.offsetWidth));
      const boundedY = Math.max(0, Math.min(newY, containerRect.height - signatureRef.current.offsetHeight));

      onPositionChange({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd?.();
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange, onDragEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!signatureRef.current) return;

    const rect = signatureRef.current.getBoundingClientRect();
    const containerRect = signatureRef.current.parentElement?.getBoundingClientRect();
    
    if (containerRect) {
      setDragOffset({
        x: e.clientX - (containerRect.left + position.x),
        y: e.clientY - (containerRect.top + position.y)
      });
      setIsDragging(true);
    }
  };

  const handleScaleChange = (direction: 'up' | 'down') => {
    const newScale = direction === 'up' ? Math.min(scale + 0.1, 3) : Math.max(scale - 0.1, 0.5);
    onScaleChange(newScale);
  };

  if (!signatureImage) {
    return (
      <div className="text-center text-gray-500 p-4">
        Por favor, crea una firma primero
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Página {onPage} • Posición: X: {Math.round(position.x)}, Y: {Math.round(position.y)}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleScaleChange('down')}
          >
            -
          </Button>
          <span className="self-center text-sm">
            {Math.round(scale * 100)}%
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => handleScaleChange('up')}
          >
            +
          </Button>
        </div>
      </div>
      
      <div 
        ref={signatureRef}
        className={`absolute cursor-move transition-transform ${
          isDragging ? 'opacity-90 z-10 shadow-lg' : 'opacity-100 z-0'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}
        onMouseDown={handleMouseDown}
      >
        <img 
          src={signatureImage} 
          alt="Signature to place on PDF" 
          className="border-2 border-blue-500 rounded bg-white shadow-md"
          style={{ pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
}