'use client';

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Trash2, Loader2, Heart } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const getId = (p) => p.id || p.idProducto || p._id;

  const loadFavorites = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/favorites', { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudieron cargar tus favoritos.');
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFavorites([]);
      setErrorMsg('No se pudieron cargar tus favoritos. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const removeFavorite = async (product) => {
    const id = getId(product);
    if (!id || removingId) return;

    setRemovingId(id);

    // Delay visual para que se note la transición
    await new Promise((resolve) => setTimeout(resolve, 250));

    try {
      const res = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar favorito');
      setFavorites((prev) => prev.filter((x) => getId(x) !== id));
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo eliminar el favorito. Inténtalo nuevamente.');
    } finally {
      setTimeout(() => setRemovingId(null), 200);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p>Comprobando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-4 animate-fade-in">
        <h1 className="text-2xl font-semibold">Tus Favoritos</h1>
        <p className="text-gray-600 text-center max-w-lg">
          Inicia sesión para guardar y sincronizar tus favoritos.
        </p>
        <div className="flex gap-3">
          <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Crear cuenta
          </Link>
          <Link href="/auth/login" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p>Cargando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="text-red-500" size={22} />
        <h1 className="text-2xl font-semibold">Mis Favoritos</h1>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {errorMsg}
        </div>
      )}

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
            const isRemoving = removingId === pid;

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
                <ProductCard product={p} />

                <button
                  onClick={() => removeFavorite(p)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-red-50 transition-all"
                  aria-label="Eliminar favorito"
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <Loader2 size={16} className="animate-spin text-red-600" />
                  ) : (
                    <Trash2 size={16} className="text-red-600" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}