"use client"
import { useQuery} from '@tanstack/react-query';
import { productTypeService } from '@/services/productType.service';
/*Create*/
export function useCreateProductType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productTypeData, token }) => productTypeService.create(productTypeData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
    },
  });
}
/*Read*/
export function useProductTypes() {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: productTypeService.getAll,
    staleTime: 10 * 60 * 1000,
  });
}
export function useProductTypesById(id){
  return useQuery({  
    queryKey: ['subCategory', id],
    queryFn: () => subCategoryService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
export function useProductTypesBySubCategoryId(subCategoryId) {
  return useQuery({
    queryKey: ['subCategories', subCategoryId],
    queryFn: () => productTypeService.getBySubCategoryId(subCategoryId),
    enabled: !!subCategoryId,
    staleTime: 10 * 60 * 1000, 
  });
}
export function useProductTypesByProductId(productId) {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => productTypeService.getByProductId(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, 
  });
}
/*Update*/
export function useUpdateProductType(id) {
  return useMutation({
    mutationFn: ({ id, productTypeData, token }) => productTypeService.update(id, productTypeData, token),
    onSuccess: (_, variables) => {
      // Invalidar caché del producto específico y la lista
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      queryClient.invalidateQueries({ queryKey: ['productType', variables.id] });
    },
    onError: (error) => {
      console.error('Error al actualizar el tipo de producto:', error);
    },
  });
}
