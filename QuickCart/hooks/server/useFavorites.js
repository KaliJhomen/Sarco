"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesService } from "@/services/favorites.service";

/**
 * Hook para obtener los favoritos del usuario autenticado
 */
export function useFavorites(payload) {
  return useQuery({
    queryKey: ["favorites", payload],
    queryFn: () => favoritesService.get(payload),
    staleTime: 30 * 1000,
    enabled: !!payload,
  });
}

/**
 * Hook para agregar un producto a los favoritos
 */
export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => favoritesService.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

/*
 * Hook para eliminar un producto de los favoritos
 */
export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idProducto) => favoritesService.remove(idProducto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

/**
 * Hook para vaciar los favoritos
 */
export function useClearFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => favoritesService.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}