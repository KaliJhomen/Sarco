"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "@/services/store.service";

// QUERIES
export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: storeService.getAll,
    staleTime: 10 * 60 * 1000,
  });
}

export function useStore(id) {
  return useQuery({
    queryKey: ["store", id],
    queryFn: () => storeService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// MUTATIONS
export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storeData, token }) => storeService.create(storeData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, storeData, token }) => storeService.update(id, storeData, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["store", variables.id] });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }) => storeService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}