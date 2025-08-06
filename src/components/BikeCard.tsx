import React, { useState } from 'react';
import type { BikeModel, BikeColor } from '@/types/bikes';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/lazy-image';
import { BikeDetailModal } from './BikeDetailModal';
import { cn } from '@/lib/utils';

interface BikeCardProps {
  bike: BikeModel;
  className?: string;
}

export function BikeCard({ bike, className }: BikeCardProps) {
  const [selectedColor, setSelectedColor] = useState<BikeColor>(bike.colors[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={cn("group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300", className)}>
      {/* Imagen Principal */}
      <div className="relative aspect-[4/3]">
        <LazyImage
          src={selectedColor.images.main}
          alt={`${bike.name} ${selectedColor.name}`}
          className="w-full h-full"
        />
        
        {/* Badge de Featured */}
        {bike.featured && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Destacado
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">{bike.name}</h3>
        
        {/* Selector de Color */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Color: {selectedColor.name}</p>
          <div className="flex gap-2 flex-wrap">
            {bike.colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200",
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

        {/* Acciones */}
        <div className="flex gap-2">
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => setIsModalOpen(true)}
          >
            Ver Detalles
          </Button>
          <Button variant="outline">
            Contactar
          </Button>
        </div>
      </div>

      {/* Modal de Detalles */}
      <BikeDetailModal
        bike={bike}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}