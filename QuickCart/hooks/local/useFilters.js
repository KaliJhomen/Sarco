'use client';
import { useState, useMemo, useEffect } from 'react';
import { useProducts } from '@/hooks/server/useProducts';
import { useSearchParams } from 'next/navigation';

export function useFilters() {
  const { data: allProducts = [], isLoading, error } = useProducts();
  const searchParams = useSearchParams();

  console.log('🔧 useFilters ejecutado');
  console.log('allProducts desde useProducts:', allProducts);
  console.log('isLoading:', isLoading);
  console.log('error:', error);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Leer filtros de URL
  const queryFromUrl = searchParams.get('q') || '';
  const categoryFromUrl = searchParams.get('c') || '';
  const subcategoryFromUrl = searchParams.get('s') || '';

  // 🔍 LOG de parámetros URL
  console.log('Parámetros URL:', {
    queryFromUrl,
    categoryFromUrl,
    subcategoryFromUrl,
  });

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    console.log('🎯 Ejecutando filtrado...');
    console.log('allProducts:', allProducts);
    
    if (!Array.isArray(allProducts)) {
      console.warn('⚠️ allProducts NO es un array:', allProducts);
      return [];
    }

    if (allProducts.length === 0) {
      console.warn('⚠️ allProducts está vacío');
      return [];
    }

    let filtered = [...allProducts];
    console.log('Productos iniciales:', filtered.length);

    // Filtro por búsqueda en URL
    if (queryFromUrl) {
      const query = queryFromUrl.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p?.nombre?.toLowerCase().includes(query) ||
          p?.descripcion?.toLowerCase().includes(query) ||
          p?.categoria?.toLowerCase().includes(query)
      );
      console.log(`Después de filtro URL (q="${queryFromUrl}"):`, filtered.length);
    }

    // Filtro por categoría en URL
    if (categoryFromUrl) {
      filtered = filtered.filter(
        (p) => p?.categoria?.toLowerCase() === categoryFromUrl.toLowerCase()
      );
      console.log(`Después de filtro categoría (c="${categoryFromUrl}"):`, filtered.length);
    }

    // Filtro por subcategoría en URL
    if (subcategoryFromUrl) {
      filtered = filtered.filter(
        (p) => p?.subcategoria?.toLowerCase() === subcategoryFromUrl.toLowerCase()
      );
      console.log(`Después de filtro subcategoría (s="${subcategoryFromUrl}"):`, filtered.length);
    }

    // Filtro por búsqueda local
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p?.nombre?.toLowerCase().includes(query) ||
          p?.descripcion?.toLowerCase().includes(query)
      );
      console.log(`Después de búsqueda local ("${searchQuery}"):`, filtered.length);
    }

    // Filtro por marca
    if (brandFilter) {
      filtered = filtered.filter((p) => p?.marca?.id === brandFilter);
      console.log(`Después de filtro marca (${brandFilter}):`, filtered.length);
    }

    // Filtro por categoría local
    if (categoryFilter) {
      filtered = filtered.filter((p) => p?.categoria?.id === categoryFilter);
      console.log(`Después de filtro categoría local (${categoryFilter}):`, filtered.length);
    }

    // Filtro por rango de precio
    if (priceRange.min > 0 || priceRange.max < Infinity) {
      filtered = filtered.filter(
        (p) =>
          (p?.precio || 0) >= priceRange.min &&
          (p?.precio || 0) <= priceRange.max
      );
      console.log(`Después de filtro precio ($${priceRange.min}-$${priceRange.max}):`, filtered.length);
    }

    // Filtro por stock
    if (inStockOnly) {
      filtered = filtered.filter((p) => (p?.stock || 0) > 0);
      console.log(`Después de filtro stock:`, filtered.length);
    }

    // Ordenamiento
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a?.precio || 0) - (b?.precio || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b?.precio || 0) - (a?.precio || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => (a?.nombre || '').localeCompare(b?.nombre || ''));
        break;
      case 'name-desc':
        filtered.sort((a, b) => (b?.nombre || '').localeCompare(a?.nombre || ''));
        break;
      case 'popular':
        filtered.sort((a, b) => (b?.ventas || 0) - (a?.ventas || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a?.createdAt || 0);
          const dateB = new Date(b?.createdAt || 0);
          return dateB - dateA;
        });
        break;
    }

    console.log('✅ Productos filtrados finales:', filtered.length);
    console.log('Productos:', filtered);
    return filtered;
  }, [
    allProducts,
    queryFromUrl,
    categoryFromUrl,
    subcategoryFromUrl,
    searchQuery,
    brandFilter,
    categoryFilter,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  // ... resto del código (activeFilters, clearFilter, clearFilters)

  return {
    filteredProducts,
    isLoading,
    error,
    activeFilters: [],
    searchQuery,
    setSearchQuery,
    brandFilter,
    setBrandFilter,
    categoryFilter,
    setCategoryFilter,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    clearFilter: () => {},
    clearFilters: () => {
      setSearchQuery('');
      setBrandFilter(null);
      setCategoryFilter(null);
      setPriceRange({ min: 0, max: Infinity });
      setInStockOnly(false);
    },
  };
}