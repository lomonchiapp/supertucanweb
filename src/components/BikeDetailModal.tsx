import React, { useState } from 'react';
import type { BikeModel, BikeColor } from '@/types/bikes';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';

interface BikeDetailModalProps {
  bike: BikeModel;
  isOpen: boolean;
  onClose: () => void;
}

export function BikeDetailModal({ bike, isOpen, onClose }: BikeDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState<BikeColor>(bike.colors[0]);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen) return null;

  const allImages = [
    selectedColor.images.main,
    selectedColor.images.front,
    ...selectedColor.images.additional.slice(0, 6)
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{bike.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="aspect-[4/3] mb-4">
                <LazyImage
                  src={allImages[selectedImage]}
                  alt={`${bike.name} ${selectedColor.name}`}
                  className="w-full h-full rounded-lg"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImage === index ? "border-primary" : "border-transparent"
                    )}
                  >
                    <LazyImage
                      src={image}
                      alt={`${bike.name} vista ${index + 1}`}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Detalles del Modelo</h3>
              
              {/* Color Selector */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Color Disponible:</p>
                <div className="flex gap-2 flex-wrap">
                  {bike.colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedImage(0);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                        selectedColor.value === color.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent"
                      )}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Especificaciones</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modelo:</span>
                    <span>{bike.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Colores disponibles:</span>
                    <span>{bike.colors.length}</span>
                  </div>
                  {bike.featured && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      <span className="text-primary font-medium">Destacado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full">
                  Solicitar Información
                </Button>
                <Button variant="outline" className="w-full">
                  Agendar Cita
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}