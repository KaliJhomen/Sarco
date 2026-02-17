'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '@/services/client.service';

// QUERIES
export function useClients(params = {}) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clienteService.getAll(params).then(res => res.data),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClient(id) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clienteService.getById(id).then(res => res.data),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchClients() {
  return useMutation({
    mutationFn: ({ q, params }) => clienteService.search(q, params).then(res => res.data),
  });
}

export function useFilterClients() {
  return useMutation({
    mutationFn: (body) => clienteService.filter(body).then(res => res.data),
  });
}

// MUTATIONS
export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => clienteService.create(data).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => clienteService.update(id, data).then(res => res.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      if (vars?.id) qc.invalidateQueries({ queryKey: ['client', vars.id] });
    },
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => clienteService.remove(id).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}