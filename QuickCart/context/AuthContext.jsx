'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
  
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      if (!token) {
        setLoading(false);
        return;
      }
      const result = await authService.getProfile(token);
      if (result.success) {
        setCliente(result.data.cliente);
        setIsAuthenticated(true);
      } else if (result.error === 'TokenExpiredError') {
        // Si el token ha expirado, intenta renovarlo 

        const refreshResult = await authService.refreshToken(token);
    
        if (refreshResult.success) {
          const { token: newToken, cliente } = refreshResult.data;
          localStorage.setItem('auth-token', newToken);
          setCliente(cliente);
          setIsAuthenticated(true);
        } else {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, clave, rememberMe = false) => {
    const result = await authService.login(email, clave);
    
    if (result.success) {
      const { token, cliente } = result.data;
      if (rememberMe) {
        localStorage.setItem('auth-token', token);
      } else {
        sessionStorage.setItem('auth-token', token);
      }

      setCliente(cliente);

      setIsAuthenticated(true);

      router.push('/');

      return { success: true };
    }

    return result;
  };

  const register = async (clienteData) => {
    return await authService.register(clienteData);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      
      // Opcional: llamar endpoint de logout en backend
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      clearAuth();
      router.push('/auth/login');
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-token');
    setCliente(null);
    setIsAuthenticated(false);
  };

  const updateCliente = async (updatedData) => {
    try {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      
      if (!token) return { success: false, error: 'No autenticado' };

      const result = await authService.updateProfile(token, updatedData);

      if (result.success) {
        setCliente(prev => ({ ...prev, ...result.data }));
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    cliente,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateCliente,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};