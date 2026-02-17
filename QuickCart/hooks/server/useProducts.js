"use client"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { productTypeProductService } from '@/services/productTypeProduct.service';

// ============================================
// QUERIES (GET - Lectura)
// ============================================

/**
 * Hook para obtener todos los productos */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
    staleTime: 5 * 60 * 1000, 
  });
}

/**
 * Hook para obtener productos con filtros complejos
 * @param {Object} filters - Filtros a aplicar
 * @param {string[]} filters.c - Array de categorías (nombres normalizados)
 * @param {string[]} filters.s - Array de subcategorías (nombres normalizados)
 * @param {string[]} filters.t - Array de tipos de producto
 * @param {number[]} filters.marca_id - Array de IDs de marcas
 * @param {number} filters.price_min - Precio mínimo
 * @param {number} filters.price_max - Precio máximo
 * @param {string} filters.busqueda - Término de búsqueda
 */
export function useFilteredProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', 'filtered', filters],
    queryFn: () => productService.getFiltered(filters),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true, // Mantiene datos anteriores durante la carga
  });
}

/**
 * Hook para obtener un producto por ID
 */
export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para buscar productos
 */
export function useSearchProducts(query) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productService.search(query),
    enabled: query?.length > 2,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook para obtener productos por marca
 */
export function useProductsByBrand(idMarca) {
  return useQuery({
    queryKey: ['products', 'brand', idMarca],
    queryFn: () => productService.getByBrand(idMarca),
    enabled: !!idMarca,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener productos por marcas
 */
export function useProductsByBrands(marcas) {
  return useQuery({
    queryKey: ['products', 'brands', marcas],
    queryFn: () => productService.getByBrands(marcas),
    enabled: Array.isArray(marcas) && marcas.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener productos por categoría
 */
export function useProductsByCategory(idCategoria) {
  return useQuery({
    queryKey: ['products', 'category', idCategoria],
    queryFn: () => productService.getByCategory(idCategoria),
    enabled: !!idCategoria,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener productos por subcategoría
 */
export function useProductsBySubCategory(idSubCategoria) {
  return useQuery({
    queryKey: ['products', 'subcategory', idSubCategoria],
    queryFn: () => productService.getBySubCategory(idSubCategoria),
    enabled: !!idSubCategoria,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener productos por Tipo Producto
 */
export function useProductsByProductType(idTipoProducto) {
  return useQuery({
    queryKey: ['products', 'productType', idTipoProducto],
    queryFn: () => productService.getByProductType(idTipoProducto),
    enabled: !!idTipoProducto,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener productos por tienda
 */
export function useProductsByStore(tienda_id) {
  return useQuery({
    queryKey: ['products', 'store', tienda_id],
    queryFn: () => productService.getByStore(tienda_id),
    enabled: !!tienda_id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener productos por tiendas
 */
export function useProductsByStores(tiendas) {
  return useQuery({
    queryKey: ['products', 'stores', tiendas],
    queryFn: () => productService.getByStores(tiendas),
    enabled: Array.isArray(tiendas) && tiendas.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// MUTATIONS (POST/PUT/DELETE)
// ============================================

/**
 * Hook para crear un producto
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, token }) => productService.create(formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Hook para actualizar un producto
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, token }) => productService.update(id, data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
}

/**
 * Hook para eliminar un producto
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }) => productService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
