'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Trash2, Loader2, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOrCreateSessionToken } from '@/utils/constants/session';
import {
  useFavorites,
  useRemoveFromFavorites,
} from '@/hooks/server/useFavorites';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const sessionToken = getOrCreateSessionToken();

  const {
    data: favoritesData,
    isLoading,
    isError,
  } = useFavorites({
    sessionToken: user ? undefined : sessionToken,
  });

  const removeFromFavoritesMutation = useRemoveFromFavorites();

  const favorites = Array.isArray(favoritesData?.items) 
    ? favoritesData.items
    : Array.isArray(favoritesData?.data?.items)
    ? favoritesData.data.items
    : [];

  const getId = (p) => p.id || p.idProducto || p._id;

  const handleRemoveFavorite = (product) => {
    const id = getId(product);
    if (!id) return;
    removeFromFavoritesMutation.mutate({
      idUser: user?.id,
      sessionToken: user ? undefined : sessionToken,
      idProducto: id,
    });
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p>Comprobando sesión...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p>Cargando favoritos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          No se pudieron cargar tus favoritos. Inténtalo nuevamente.
        </div>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="text-red-500" size={22} />
        <h1 className="text-2xl font-semibold">Mis Favoritos</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No tienes productos en favoritos.
          <div className="mt-4">
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Ir a la tienda
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((p, index) => {
            const pid = getId(p);
            const isRemoving =
              removeFromFavoritesMutation.variables?.idProducto === pid &&
              removeFromFavoritesMutation.isPending;

            return (
              <div
                key={pid || `fav-${index}`}
                className={`relative transition-all duration-500 ${
                  isRemoving ? 'opacity-0 scale-95 -translate-y-2' : 'opacity-100 scale-100'
                }`}
                style={{
                  animationName: 'slide-in-right',
                  animationDuration: '0.45s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'forwards',
                  animationDelay: `${index * 0.08}s`,
                }}
              >
                <ProductCard product={p} layout="horizontal" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}