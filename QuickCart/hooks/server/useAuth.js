"use client"
import { useContext, useQuery } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import axios from 'axios';

// ============================================
// QUERIES (GET - Lectura)
// ============================================

/**
 * Hook para obtener datos del usuario autenticado
 */
export function useMe(token) {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token no válido o no proporcionado');
      }
      return authService.getMe(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};

// ============================================
// MUTATIONS (POST/PUT - Escritura)
// ============================================

/**
 * Hook para login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Guardar datos del usuario en caché
      queryClient.setQueryData(['user', 'me'], data.user);
    },
  });
}

/**
 * Hook para registro
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      queryClient.setQueryData(['user', 'me'], data.user);
    },
  });
}

/**
 * Hook para actualizar perfil
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userData, token }) => authService.updateProfile(userData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

/**
 * Hook para cambiar contraseña
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ passwordData, token }) => authService.changePassword(passwordData, token),
  });
}

/**
 * Hook para logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token) => authService.logout(token),
    onSuccess: () => {
      // Limpiar token
      localStorage.removeItem('token');
      
      // Limpiar caché
      queryClient.clear();
    },
  });
}

/**
 * Hook para obtener datos del usuario autenticado (usando axios)
 */
export const useAuthData = () => {
  const { data, error, isLoading } = useQuery('auth', async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      return response.data;
    } catch (err) {
      console.error('Error al obtener datos de autenticación:', err);
      throw new Error('No se pudo obtener los datos de autenticación.');
    }
  }, {
    retry: false, // Disable retries for authentication
    refetchOnWindowFocus: false, // Prevent refetching when the window regains focus
  });

  
  return {
    isAuthenticated: !!data, // If data exists, the user is authenticated
    user: data || null, // Return the user data if authenticated
    isLoading: isLoading || false, // Ensure isLoading is never undefined
    error: error || null, // Ensure error is never undefined
  };
};