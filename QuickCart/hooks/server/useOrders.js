"use client"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ordersService from '@/services/orders.service';

// ============================================
// QUERIES (GET - Lectura)
// ============================================

/**
 * Hook para obtener todas las órdenes del usuario
 */
export function useOrders(token) {
  return useQuery({
    queryKey: ['orders', token],
    queryFn: () => ordersService.getAllOrders(token),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obtener una orden por ID
 */
export function useOrder(id, token) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getOrderById(id, token),
    enabled: !!id && !!token,
    staleTime: 1 * 60 * 1000,
  });
}

// ============================================
// MUTATIONS (POST/PUT/DELETE - Escritura)
// ============================================

/**
 * Hook para crear una orden
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderData, token }) => ordersService.createOrder(orderData, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.token] });
      queryClient.invalidateQueries({ queryKey: ['cart', variables.token] });
    },
  });
}

/**
 * Hook para actualizar estado de una orden
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, token }) => ordersService.updateOrderStatus(id, status, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.token] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

/**
 * Hook para cancelar una orden
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }) => ordersService.cancelOrder(id, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.token] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}