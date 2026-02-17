'use client'
import React from 'react';
import Image from 'next/image';
import AnunciosCarousel from '@/components/sections/AnunciosCarousel'; // Importar el nuevo componente
import { Search, Laptop, Home, Car, Tag, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  const categories = [
    { 
      id: 1, 
      name: 'Ofertas', 
      icon: Tag,
      image: '/articulos/65A6NA.jfif',
      color: 'from-gray-200 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700',
      description: 'Aprovéchalas!'
    },
    { 
      id: 2, 
      name: 'Tecnología', 
      icon: Laptop,
      image: '/articulos/18M38H.png',
      color: 'from-gray-200 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700',
      description: 'Lo último en tech'
    },
    { 
      id: 3, 
      name: 'Mueblería', 
      icon: Home,
      image: '/articulos/250-22.jpeg',
      color: 'from-gray-200 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700',
      description: 'Para tu Hogar'
    },
    { 
      id: 4, 
      name: 'Movilidad', 
      icon: Car,
      image: '/articulos/CASCO LS2.jpeg', 
      color: 'from-gray-200 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700',
      description: 'Transporte'
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 overflow-hidden">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 max-w-[1920px] mx-auto py-12 md:py-16">
        {/* Contenido principal */}
  
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 lg:col-span-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 animate-pulse">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-white text-sm font-semibold"> </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Encuentra todo lo que buscas
            </h1>
            <p className="text-lg md:text-xl text-red-100 mb-8">
              Miles de productos de calidad y las mejores ofertas
            </p>

            {/* Barra de búsqueda */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex items-center bg-white rounded-lg shadow-2xl overflow-hidden max-w-2xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos, marcas y más..."
                  className="flex-1 px-4 py-4 text-gray-700 outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-4 bg-red-700 text-white hover:bg-red-800 transition-colors"
                >
                  <Search size={24} />
                </button>
              </div>
            </form>

            {/* Categorías rápidas con imágenes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    
                    onClick={() => router.push(`/shop/${category.name}`)}
                    className={`group relative p-5 md:p-6 rounded-xl bg-gradient-to-br ${category.color} ${category.hoverColor} text-white shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ${category.name === 'Ofertas' ? 'overflow-visible' : 'overflow-hidden'} backdrop-blur-sm`}
                  >
                    {/* Imagen de fondo con overlay */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
                      />
                      {/* Overlay gradiente */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}></div>
                    </div>

                    {/* Brillo animado al hacer hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shimmer"></div>
                    
                    {/* Contenido */}
                    <div className="relative z-10 flex flex-col items-center text-center gap-2">
                      {/* Icono con animación */}
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                        <Icon size={24} className="group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      
                      {/* Nombre de categoría */}
                      <div>
                        <p className="font-bold text-base md:text-lg">{category.name}</p>
                        <p className="text-xs opacity-90 mt-0.5">{category.description}</p>
                      </div>
                      
                      {/* Flecha con animación */}
                      <div className="flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span>Ver más</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </div>

                    {/* Badge especial para ofertas */}
                    {category.name === 'Ofertas' && (
                      <div className="absolute -top-3 -right-3 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-400 blur-sm opacity-50 rounded-full"></div>
                          <div className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 text-red-900 text-xs font-black px-3 py-1.5 rounded-full shadow-2xl animate-bounce border-2 border-white">
                            OFERTAS
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Derecha: carrusel (oculto en pantallas pequeñas) */}
          <div className="md:col-span-5 lg:col-span-4 hidden md:block">
            <div className="w-full rounded-lg overflow-hidden shadow-2xl">
              <AnunciosCarousel />
            </div>
          </div>
        </div>
     </div>
   </section>
 );
};

export default HeroSection;