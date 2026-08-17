'use client';
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
export const AuthContext = createContext(null);

export function useAuth() {
  const context =useContext(AuthContext);
  if (!context){
      throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!cliente;

  useEffect(() =>{ 
    let cancelled = false;
    const verifyAuth = async () => { 
      try {
        const result = await authService.getProfile();
         if (!cancelled) {
          if (result.success) {
            setCliente(result.data.cliente);
          } else {
            // Token invalid/expired - interceptor handles refresh on 401
            // This is just initial page load check
            clearAuth();
          }
        }
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verifyAuth();
    return () => { cancelled = true; };
  }, []);

  const login = async (email, clave, rememberMe = false) => {
    const result = await authService.login(email, clave);
    if (result.success) {
      const { token, cliente: clienteData } = result.data;
      if (rememberMe) {
        localStorage.setItem('auth-token', token);
      } else {
        sessionStorage.setItem('auth-token', token);
      }

      setCliente(clienteData);
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
      localStorage.removeItem('sessionToken');
      await authService.logout();
    } catch {

    } finally {
      clearAuth();
      router.push('/auth/login');
    }
  };

  const clearAuth = useCallback(() => {
    localStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-token');
    setCliente(null);
  }, []);

  const updateCliente = async (updatedData) => {
    try {
      const result = await authService.updateProfile(updatedData);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};