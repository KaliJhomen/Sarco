'use client';
import React from 'react';
import Carousel from '@/components/ads/Carousel';
import { useAds } from '@/hooks/server/useAds';
import { useRouter } from 'next/navigation';

const AnunciosCarousel = () => {
  const router = useRouter();
  const { data: anuncios = [], isLoading } = useAds();

  // Convertir anuncios a formato de slides
  const slides = React.useMemo(() => {
    return anuncios.map(anuncio => ({
      id: anuncio.idAnuncio,
      src: anuncio.imagen,
      alt: anuncio.titulo,
      caption: anuncio.titulo,
      urlDestino: anuncio.urlDestino,
    }));
  }, [anuncios]);

  const handleSlideClick = (slide) => {
    if (slide.urlDestino) {
      if (slide.urlDestino.startsWith('http')) {
        window.open(slide.urlDestino, '_blank');
      } else {
        router.push(slide.urlDestino);
      }
    }
  };

  if (isLoading || slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-2xl cursor-pointer">
      <Carousel 
        slides={slides} 
        autoplay={5000} 
        className="w-full"
        onSlideClick={handleSlideClick}
      />
    </div>
  );
};

export default AnunciosCarousel;