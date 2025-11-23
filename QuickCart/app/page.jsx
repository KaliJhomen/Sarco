'use client'
import React, { useState, useMemo, useCallback } from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import CategorySection from "@/components/sections/CategorySection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import ProductsSection from "@/components/sections/ProductsSection";
import CategoriesMenu from "@/components/filters/CategoriesMenu";
import FiltersBar from "@/components/filters/FiltersBar";
import FiltersSidebar from "@/components/filters/FiltersSidebar";
import InlineFilters from "@/components/filters/InlineFilters";
import ActiveFilters from "@/components/filters/ActiveFilters";
import Breadcrumbs from "@/components/filters/Breadcrumbs";
import { useProducts } from "@/hooks/server/useProducts";
import { applyFilters, applySort } from "@/components/filters/filters.utils";

const HomePage = () => {
  const [filters, setFilters] = useState({
    search: '', category: null, brand: null,
    minPrice: 0, maxPrice: Infinity, inStock: false, onSale: false,
  });
  const [sortBy, setSortBy] = useState('featured');
  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const { data: allProducts = [], isLoading } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return [];
    let result = applyFilters(allProducts, filters);
    return applySort(result, sortBy);
  }, [allProducts, filters, sortBy]);



  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', category: null, brand: null, minPrice: 0, maxPrice: Infinity, inStock: false, onSale: false });
    setSortBy('featured');
  }, []);

  const removeFilter = useCallback((filterKey) => {
    const actions = {
      search: () => setFilters(prev => ({ ...prev, search: '' })),
      category: () => setFilters(prev => ({ ...prev, category: null })),
      brand: () => setFilters(prev => ({ ...prev, brand: null })),
      priceRange: () => setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: Infinity })),
      inStock: () => setFilters(prev => ({ ...prev, inStock: false })),
      onSale: () => setFilters(prev => ({ ...prev, onSale: false })),
    };
    actions[filterKey]?.();
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minPrice > 0 || filters.maxPrice < Infinity) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    return count;
  }, [filters]);

  const breadcrumbsData = useMemo(() => [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/products' },
  ], []);

  return (
    <div className="min-h-screen bg-gray-50">      
      <main>
        <HeroSection />
        <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 max-w-[1920px] mx-auto pt-6">
          <Breadcrumbs items={breadcrumbsData} />
        </div>

        <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 max-w-[1920px] mx-auto py-4">
          <FiltersBar
            filters={filters}
            onFilterChange={updateFilters}
            onSortChange={setSortBy}
            sortBy={sortBy}
            totalResults={filteredProducts.length}
            totalProducts={allProducts.length}
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
            onResetFilters={resetFilters}
            activeFiltersCount={activeFiltersCount}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 max-w-[1920px] mx-auto">
          <InlineFilters
            filters={filters}
            onFilterChange={updateFilters}
            onResetFilters={resetFilters}
            products={allProducts}
          />
        </div>

        <ActiveFilters
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          onRemoveFilter={removeFilter}
          onResetFilters={resetFilters}
        />

        <section className="py-8 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 max-w-[1920px] mx-auto">
          <div className="flex gap-6">
            
            <aside className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
              <FiltersSidebar
                filters={filters}
                onFilterChange={updateFilters}
                onResetFilters={resetFilters}
                products={allProducts}
              />
            </aside>

            <div className="flex-1">
              {activeFiltersCount === 0 && !isLoading && (
                <>
                  <div className="mb-12"><FeaturedSection /></div>
                  <div className="mb-12"><CategorySection /></div>
                </>
              )}
            </div>
          </div>
        </section>
        
        <NewsletterSection />
          <ProductsSection
            filteredProducts={filteredProducts}
            allProducts={allProducts}
            searchQuery={filters.search}
            isLoading={isLoading}
            viewMode={viewMode}
            onClearFilters={resetFilters}
            hasActiveFilters={activeFiltersCount > 0}
          />
      </main>      
    </div>
  );
};

export default HomePage;
