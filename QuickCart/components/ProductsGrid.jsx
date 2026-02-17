"use client"
import React from 'react';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductsGrid = ({ 
  title = '', 
  products = [],
  loading = false,
  gridCols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  cta,
  emptyMessage = 'No se encontraron productos'
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-4">
        {title && (
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        )}
        <div className={`grid ${gridCols} gap-4`}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-normal text-gray-900">
            {title}
          </h2>
          {cta && (
            <button
              onClick={() => router.push(cta.href)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
            >
              {cta.text}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {/* Grid de productos */}
      <div className={`grid ${gridCols} gap-4`}>
        {products.map((product) => (
          <ProductCard 
            key={product.idProducto} 
            product={product} 
          />
        ))}
      </div>

      {/* CTA al final */}
      {cta && products.length >= 12 && (
        <div className="text-center pt-6">
          <button
            onClick={() => router.push(cta.href)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {cta.text}
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;