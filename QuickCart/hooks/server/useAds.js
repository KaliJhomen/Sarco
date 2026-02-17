import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adService } from '@/services/ad.service';

export function useAds() {
  return useQuery({
    queryKey: ['anuncios'],
    queryFn: adService.getAll,
    staleTime: 10 * 60 * 1000, 
  });
}

export function useCreateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, token }) => adService.create(formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anuncios'] });
    },
  });
}

export function useUpdateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }) => adService.update(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anuncios'] });
    },
  });
}

export function useDeleteAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }) => adService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anuncios'] });
    },
  });
}
