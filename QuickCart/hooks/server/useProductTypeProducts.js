"use client"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productTypeProductService } from '@/services/productTypeProduct.service';

// ============================================
// QUERIES (GET - Lectura)
// ============================================
/* Hook para obtener todos los productos */
export function useProductTypeProducts() {
  return useQuery({
    queryKey: ['producttypeproducts'],
    queryFn: productTypeProductService.getAll,
    staleTime: 5 * 60 * 1000, 
  });
}
// ============================================
// MUTATIONS (Escritura)
// ============================================
/**
 * Hook para crear un producto
 */
export function useCreateProductTypeProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productTypeProductData, token }) => productTypeProductService.create(productTypeProductData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producttypeproducts'] });
    },
    onError: (error) => {
      console.error('Error al crear el producto tipo producto:', error);
    },
  });
}
