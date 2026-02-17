'use client'
import React, { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import CategorySection from "@/components/sections/CategorySection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Breadcrumbs from "@/components/filters/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { useFilteredProducts } from "@/hooks/server/useProducts";

const PRODUCTS_PER_PAGE = 12;

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isPending, startTransition] = useTransition();

  // Obtener filtros desde URL
  const categories = searchParams.getAll("c[]");
  const subcategories = searchParams.getAll("s[]");
  const priceMin = Number(searchParams.get("price_min")) || undefined;
  const priceMax = Number(searchParams.get("price_max")) || undefined;
  const brandIds = searchParams.getAll("marca_id[]").map(id => Number(id));

  // Obtener productos filtrados desde el backend
  const { data: allFilteredProducts = [], isLoading } = useFilteredProducts({
    c: categories.length > 0 ? categories : undefined,
    s: subcategories.length > 0 ? subcategories : undefined,
    marca_id: brandIds.length > 0 ? brandIds : undefined,
    price_min: priceMin,
    price_max: priceMax,
  });

  // Aplicar ordenamiento local
  const sortedProducts = React.useMemo(() => {
    const products = [...allFilteredProducts];

    if (sortBy === 'price-low') {
      products.sort((a, b) => (a.precioVenta || 0) - (b.precioVenta || 0));
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => (b.precioVenta || 0) - (a.precioVenta || 0));
    } else if (sortBy === 'newest') {
      products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'name') {
      products.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
    }

    return products;
  }, [allFilteredProducts, sortBy]);

  // Limitar para la homepage
  const displayedProducts = sortedProducts.slice(0, PRODUCTS_PER_PAGE);
  const hasMoreProducts = sortedProducts.length > PRODUCTS_PER_PAGE;

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      router.replace('/', { scroll: false });
    });
  }, [router]);

  // Construir URL para "Ver todos"
  const buildAllProductsUrl = useCallback(() => {
    const params = new URLSearchParams();
    categories.forEach(c => params.append("c[]", c));
    subcategories.forEach(s => params.append("s[]", s));
    brandIds.forEach(id => params.append("marca_id[]", id));
    if (priceMin) params.set("price_min", String(priceMin));
    if (priceMax) params.set("price_max", String(priceMax));
    if (sortBy && sortBy !== 'newest') params.set("sort", sortBy);

    return `/shop/productos?${params.toString()}`;
  }, [categories, subcategories, priceMin, priceMax, brandIds, sortBy]);

  const hasActiveFilters = categories.length > 0 || subcategories.length > 0 ||
    priceMin !== undefined || priceMax !== undefined || brandIds.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <HeroSection />

        <section className="py-8 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 max-w-[1920px] mx-auto">
          <div className="flex gap-6">
            <div className="flex-1">
              {/* Secciones Featured y Category - solo sin filtros */}
              {!hasActiveFilters && (
                <>
                  <div className="mb-12"><FeaturedSection /></div>
                  <div className="mb-12"><CategorySection /></div>
                </>
              )}

              {/* Breadcrumbs (si hay filtros activos) */}
              {hasActiveFilters && (
                <div className="mb-6">
                  <Breadcrumbs />
                </div>
              )}

              {/* Controles */}
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Mostrando {displayedProducts.length} de {sortedProducts.length} producto{sortedProducts.length !== 1 ? 's' : ''}
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Más nuevo</option>
                    <option value="price-low">Precio: Menor a Mayor</option>
                    <option value="price-high">Precio: Mayor a Menor</option>
                    <option value="name">Nombre (A-Z)</option>
                  </select>

                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                    >
                      ⊞
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                    >
                      ☰
                    </button>
                  </div>
                </div>
              </div>

              {/* Productos */}
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-[260px] bg-gray-200 rounded-lg h-80 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500 mb-4">No hay productos disponibles con los filtros seleccionados.</p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                      {displayedProducts.map((p, idx) => {
                        const key = p.id || p.idProducto || p._id || idx;
                        return (
                          <div key={key} className="w-[260px]">
                            <ProductCard product={p} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {hasMoreProducts && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => router.push(buildAllProductsUrl())}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Ver todos ({sortedProducts.length - PRODUCTS_PER_PAGE} más)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
    </div>
  );
};

export default HomePage;
