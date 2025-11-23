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

/* Hook para obtener productos con stock */
/*
export function useProductsInStock() {
  return useQuery({
    queryKey: ['products', 'in-stock'],
    queryFn: async () => {
      const allProducts = await productService.getAll();
      
      // Filtrar solo productos con stock > 0
      return allProducts.filter(product => {
        // Si tiene múltiples colores con stock
        if (product.colores && Array.isArray(product.colores)) {
          return product.colores.some(color => color.stock > 0);
        }
        
        // Si tiene un campo stock directo
        if (product.stock !== undefined) {
          return product.stock > 0;
        }
        
        // Por defecto, incluir el producto
        return true;
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}
*/
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
// MUTATIONS (POST/PUT/DELETE - Escritura)
// ============================================

/**
 * Hook para crear un producto
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productData, token }) => productService.create(productData, token),
    onSuccess: () => {
      // Invalidar caché para refrescar lista
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error al crear producto:', error);
    },
  });
}

/**
 * Hook para actualizar un producto
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, productData, token }) => productService.update(id, productData, token),
    onSuccess: (_, variables) => {
      // Invalidar caché del producto específico y la lista
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
    onError: (error) => {
      console.error('Error al actualizar producto:', error);
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
    onError: (error) => {
      console.error('Error al eliminar producto:', error);
    },
  });
}

/**
 * Hook para actualizar stock de un producto
 */
export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, colorId, quantity, token }) => 
      productService.updateStock(id, colorId, quantity, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error al actualizar stock:', error);
    },
  });
}

/**
 * Hook para invalidar/refrescar productos
 */
export function useRefreshProducts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
}
