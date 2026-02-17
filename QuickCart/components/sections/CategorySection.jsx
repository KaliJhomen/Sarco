'use client'
import React from 'react';
import ProductsGrid from '@/components/ProductsGrid';
import { useProducts } from '@/hooks/server/useProducts';

// Componente de sección individual
const CategorySection = ({ 
  title, 
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  filterFn,
  limit = 12,
  description,
  sortFn
}) => {
  const { data: allProducts = [], isLoading, error } = useProducts();

  const products = React.useMemo(() => {
    if (!Array.isArray(allProducts)) {
      return [];
    }
    // Aplicar filtro personalizado
    let filtered = filterFn ? allProducts.filter(filterFn) : allProducts;
    // Aplicar ordenamiento personalizado
    if (sortFn) {
      filtered = [...filtered].sort(sortFn);
    }
    // Limitar cantidad
    const limited = filtered.slice(0, limit);
    return limited;
  }, [allProducts, filterFn, limit, sortFn, title]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${iconBgColor} rounded-lg animate-pulse`}>
            {Icon && <Icon className={iconColor} size={24} />}
          </div>
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            {description && <div className="h-4 w-64 bg-gray-100 rounded mt-2 animate-pulse"></div>}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Error al cargar productos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header de la sección */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${iconBgColor} rounded-lg shadow-sm`}>
            {Icon && <Icon className={iconColor} size={24} />}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Grid de productos */}
      <ProductsGrid
        products={products}
        loading={isLoading}
        cta={products.length > 0 ? { text: `Ver todos`, href: `/shop/products` } : null}
      />

      {/* Mensaje si no hay productos */}
      {products.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay productos disponibles en esta sección</p>
        </div>
      )}
    </div>
  );
};

export default CategorySection;