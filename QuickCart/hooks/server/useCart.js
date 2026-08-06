"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";

/*
 * Hook para obtener el carrito del usuario autenticado
 */
export function useCart({idUser, sessionToken}) {
  return useQuery({
    queryKey: ["cart", idUser, sessionToken],
    queryFn: () => cartService.get({ idUser, sessionToken }),
    
    staleTime: 30 * 1000,
  });
}

/**
 * Hook para agregar un producto al carrito
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => cartService.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/**
 * Hook para actualizar la cantidad de un producto en el carrito
 */
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idProducto, quantity }) => cartService.update(idProducto, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/**
 * Hook para eliminar un producto del carrito
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => cartService.remove(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/**
 * Hook para vaciar el carrito
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useGenerateShareCart() {
  return useMutation({
    mutationFn: (ident) => cartService.generateShareToken(ident),
  });
}

export function useSharedCart(shareToken) {
  return useQuery({
    queryKey: ["sharedCart", shareToken],
    queryFn: () => cartService.getSharedCart(shareToken),
    enabled: !!shareToken,
  });
}