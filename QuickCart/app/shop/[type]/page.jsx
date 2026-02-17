'use client';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname, useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/filters/Breadcrumbs';
import CategoriesMenu from '@/components/filters/CategoriesMenu';
import FiltersSidebar from '@/components/filters/FiltersSidebar';
import { Loader2, Grid3x3, List, SlidersHorizontal, ChevronUp, X } from 'lucide-react';
import { useFilteredProducts } from '@/hooks/server/useProducts';

// Configuración de tipos de tienda
const SHOP_TYPES = {
  productos:{
    title: 'Productos',
    baseFilters: {},
  },
  ofertas: {
    title: 'Ofertas',
    baseFilters: { hasDiscount: true }, 
  },

  electrodomesticos: {
    title: 'Electrodomésticos',
    baseFilters: { c: ['Linea Blanca'] },
  },
  /*2*/
  muebleria: {
    title: 'Mueblería',
    baseFilters: { c: ['Dormitorio, Muebles' ] },
  },
  /*4,5*/
  movilidad: {
    title: 'Movilidad',
    baseFilters: { c: ["Motos"] },
  /*9*/
  },
}; 

const ShopPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  
  // Obtener tipo de tienda desde URL
  const shopType = params?.type || 'all';
  const shopConfig = SHOP_TYPES[shopType] || { title: 'Productos', baseFilters: {} };

  // Estados locales
  const [viewMode, setViewMode] = useState('grid');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const PRODUCTS_PER_PAGE = 20;
  const [displayedProductsCount, setDisplayedProductsCount] = useState(PRODUCTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  // Obtener filtros del usuario desde URL
  const userCategories = useMemo(() => searchParams.getAll('c[]'), [searchParams]);
  const userSubcategories = useMemo(() => searchParams.getAll('s[]'), [searchParams]);
  const userBrands = useMemo(() => searchParams.getAll('marca_id[]').map(Number), [searchParams]);
  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  const searchQuery = searchParams.get('q') || '';

  // Combinar filtros base con filtros de usuario
  const filtersKey = useMemo(() => {
    const baseFilters = shopConfig.baseFilters || {};
    
    // Categorías: usar las del usuario si existen, sino las base
    const finalCategories = userCategories.length > 0 
      ? userCategories 
      : (baseFilters.c || []);
    
    const filterObj = {
      c: finalCategories.length > 0 ? finalCategories.join(',') : null,
      s: userSubcategories.length > 0 ? userSubcategories.join(',') : null,
      marca_id: userBrands.length > 0 ? userBrands.join(',') : null,
      price_min: priceMin || null,
      price_max: priceMax || null,
      busqueda: searchQuery || null,
      hasDiscount: shopConfig.baseFilters.hasDiscount === true ? 'true' : null,
    };
    return JSON.stringify(filterObj);
  }, [shopConfig.baseFilters, userCategories, userSubcategories, userBrands, priceMin, priceMax, searchQuery]);

  const filters = useMemo(() => {
    const parsed = JSON.parse(filtersKey);
    return {
      c: parsed.c ? parsed.c.split(',') : undefined,
      s: parsed.s ? parsed.s.split(',') : undefined,
      marca_id: parsed.marca_id ? parsed.marca_id.split(',').map(Number) : undefined,
      price_min: parsed.price_min ? Number(parsed.price_min) : undefined,
      price_max: parsed.price_max ? Number(parsed.price_max) : undefined,
      busqueda: parsed.busqueda || undefined,
      hasDiscount: parsed.hasDiscount === 'true' ? true : undefined, 
    };
  }, [filtersKey]);

  // Obtener productos filtrados del backend
  const { data: allProducts = [], isLoading, error } = useFilteredProducts(filters);

  // Aplicar ordenamiento local
  const sortedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    
    const sorted = [...allProducts];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.precioVenta - b.precioVenta);
      case 'price-desc':
        return sorted.sort((a, b) => b.precioVenta - a.precioVenta);
      case 'name-asc':
        return sorted.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
      case 'name-desc':
        return sorted.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
      case 'popular':
        return sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso));
    }
  }, [allProducts, sortBy]);

  // Productos a mostrar (paginados)
  const displayedProducts = useMemo(() => {
    return sortedProducts.slice(0, displayedProductsCount);
  }, [sortedProducts, displayedProductsCount]);

  // Indicadores de paginación
  const hasMoreProducts = displayedProductsCount < sortedProducts.length;
  const progressPercentage = sortedProducts.length > 0 
    ? Math.round((displayedProductsCount / sortedProducts.length) * 100) 
    : 0;

  // Filtros activos para mostrar
  const activeFilters = useMemo(() => {
    const filters = [];
    
    // Solo mostrar categorías si son filtros de usuario (no base)
    if (userCategories.length > 0) {
      userCategories.forEach(cat => filters.push({ type: 'category', value: cat, label: `${cat}` }));
    }
    
    if (userSubcategories.length > 0) {
      userSubcategories.forEach(sub => filters.push({ type: 'subcategory', value: sub, label: `${sub}` }));
    }
    
    if (userBrands.length > 0) {
      filters.push({ type: 'brands', value: userBrands, label: `${userBrands.length} marca${userBrands.length !== 1 ? 's' : ''}` });
    }
    
    if (priceMin || priceMax) {
      filters.push({ type: 'price', value: { min: priceMin, max: priceMax }, label: `$${priceMin || 0} - $${priceMax || '∞'}` });
    }
    
    if (searchQuery) {
      filters.push({ type: 'search', value: searchQuery, label: `"${searchQuery}"` });
    }
    
    return filters;
  }, [userCategories, userSubcategories, userBrands, priceMin, priceMax, searchQuery]);

  // Función para remover filtro
  const removeFilter = useCallback((filter) => {
    const params = new URLSearchParams(searchParams.toString());
    
    switch (filter.type) {
      case 'category':
        params.delete('c[]');
        userCategories.filter(c => c !== filter.value).forEach(c => params.append('c[]', c));
        break;
      case 'subcategory':
        params.delete('s[]');
        userSubcategories.filter(s => s !== filter.value).forEach(s => params.append('s[]', s));
        break;
      case 'brands':
        params.delete('marca_id[]');
        break;
      case 'price':
        params.delete('price_min');
        params.delete('price_max');
        break;
      case 'search':
        params.delete('q');
        break;
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router, userCategories, userSubcategories]);

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  // Cargar más productos
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMoreProducts) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedProductsCount(prev => 
        Math.min(prev + PRODUCTS_PER_PAGE, sortedProducts.length)
      );
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMoreProducts, sortedProducts.length]);

  // Intersection Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreProducts && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMoreProducts, isLoadingMore, loadMore]);

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setDisplayedProductsCount(PRODUCTS_PER_PAGE);
  }, [filtersKey]);

  // Detectar scroll para botón "volver arriba"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Loading state
  if (isLoading && sortedProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl w-full">
          <h2 className="text-red-800 font-bold mb-2">Error al cargar productos</h2>
          <p className="text-red-600 text-sm mb-4">{error?.message || 'Error desconocido'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-4" />

        {/* Menú de categorías */}
        <CategoriesMenu className="mb-6" />

        {/* Layout con sidebar */}
        <div className="flex gap-6">

          {/* Sidebar de filtros (desktop) */}
          {showSidebar && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FiltersSidebar />
              </div>
            </aside>
          )}

          {/* Contenido principal */}
          <main className="flex-1 min-w-0">
            
            {/* Header con controles */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-20 z-40">
              <div className="flex items-center justify-between flex-wrap gap-4">
                
                {/* Info de resultados */}
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {shopConfig.title}
                  </h1>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-semibold">
                      {displayedProducts.length} de {sortedProducts.length} productos
                    </p>
                  </div>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-3 flex-wrap">
                  
                  {/* Botón filtros móvil */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
                  >
                    <SlidersHorizontal size={18} />
                    Filtros
                    {activeFilters.length > 0 && (
                      <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {activeFilters.length}
                      </span>
                    )}
                  </button>

                  {/* Toggle sidebar (desktop) */}
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="hidden lg:block px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title={showSidebar ? 'Ocultar filtros' : 'Mostrar filtros'}
                  >
                    <SlidersHorizontal size={18} />
                  </button>

                  {/* Ordenar */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium bg-white cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="price-asc">Precio: Menor a mayor</option>
                    <option value="price-desc">Precio: Mayor a menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                    <option value="popular">Más populares</option>
                  </select>

                  {/* Vista grid/list 
                  <div className="hidden sm:flex gap-1 border border-gray-300 rounded-lg p-1 bg-white">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-all ${
                        viewMode === 'grid'
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Vista en cuadrícula"
                    >
                      <Grid3x3 size={18} />
                    </button>
                  </div>
                  */}
                </div>
              </div>

              {/* Filtros activos (tags) */}
              {activeFilters.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
                  {activeFilters.map((filter, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                    >
                      {filter.label}
                      <button
                        onClick={() => removeFilter(filter)}
                        className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium underline"
                  >
                    Limpiar todos
                  </button>
                </div>
              )}
            </div>

            {/* Filtros móviles (drawer) */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6">
                <FiltersSidebar />
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                >
                  Aplicar filtros
                </button>
              </div>
            )}

            {/* Empty state */}
            {sortedProducts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeFilters.length > 0
                      ? 'Intenta ajustar los filtros para ver más resultados'
                      : 'No hay productos disponibles en este momento'}
                  </p>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Grid de productos */}
            {sortedProducts.length > 0 && (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id || product.idProducto}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="flex justify-center items-center py-8 mt-6">
                    <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                    <span className="ml-3 text-gray-600 font-medium">Cargando más productos...</span>
                  </div>
                )}

                {/* Intersection Observer Target */}
                {hasMoreProducts && !isLoadingMore && (
                  <div ref={observerTarget} className="h-20 flex items-center justify-center mt-6">
                    <div className="text-gray-400 text-sm">
                      ↓ Desplázate para cargar más...
                    </div>
                  </div>
                )}

                {/* Mensaje final */}
                {!hasMoreProducts && (
                  <div className="text-center mt-8 py-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <p className="text-gray-600 font-medium mb-2">
                      Has visto todos los {sortedProducts.length} productos
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      ¿No encontraste lo que buscas? Intenta ajustar los filtros
                    </p>
                    <button
                      onClick={scrollToTop}
                      className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Volver arriba
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Botón flotante "Volver arriba" */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all hover:shadow-xl z-50"
          title="Volver arriba"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default ShopPage;


