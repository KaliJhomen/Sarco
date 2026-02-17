"use client"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subCategoryService } from '@/services/subCategory.service';

// ============================================
// QUERIES (GET - Lectura)
// ============================================

/**
 * Hook para obtener todas las categorías
 */
export function useSubCategories() {
  return useQuery({
    queryKey: ['subCategories'],
    queryFn: subCategoryService.getAll,
    staleTime: 10 * 60 * 1000, 
  });
}
export function useSubCategoriesByCategoryId(categoryId) {
  return useQuery({
    queryKey: ['subCategories', categoryId],
    queryFn: () => subCategoryService.getByCategoryId(categoryId),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, 
  });
}
export function useSubCategoriesById(id){
  return useQuery({  
    queryKey: ['subCategory', id],
    queryFn: () => subCategoryService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/* Hook para crear una subcategoría
 */
export function useCreateSubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subCategoryData, token }) => subCategoryService.create(subCategoryData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subCategories'] });
    },
  });
}

/**
 * Hook para actualizar una subcategoría
 */
export function useUpdateSubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, subCategoryData, token }) => subCategoryService.update(id, subCategoryData, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['subCategories'] });
      queryClient.invalidateQueries({ queryKey: ['subCategory', variables.id] });
    },
  });
}