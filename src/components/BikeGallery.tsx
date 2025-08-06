import React from 'react';
import { BikeCard } from './BikeCard';
import type { BikeModel } from '@/types/bikes';
import { cn } from '@/lib/utils';

interface BikeGalleryProps {
  bikes: BikeModel[];
  title?: string;
  className?: string;
}

export function BikeGallery({ bikes, title, className }: BikeGalleryProps) {
  return (
    <section className={cn("py-12", className)}>
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bikes.map((bike) => (
          <BikeCard key={bike.id} bike={bike} />
        ))}
      </div>
    </section>
  );
}