"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';

/**
 * Hook para obtener el carrito del usuario
 */
export function useCart(userId) {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: () => cartService.get(userId),
    enabled: !!userId, // Solo se ejecuta si hay un userId
    staleTime: 30 * 1000, // 30 segundos (el carrito puede cambiar frecuentemente)
  });
}

/**
 * Hook para agregar un producto al carrito
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId, quantity }) =>
      cartService.add(userId, productId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    },
  });
}

/**
 * Hook para actualizar la cantidad de un producto en el carrito
 */
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId, quantity }) =>
      cartService.update(userId, productId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    },
  });
}

/**
 * Hook para eliminar un producto del carrito
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }) =>
      cartService.remove(userId, productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    },
  });
}

/**
 * Hook para vaciar el carrito
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => cartService.clear(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
  });
}