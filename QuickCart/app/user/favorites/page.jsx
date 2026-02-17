'use client';

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Trash2 } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/favorites', { cache: 'no-store' });
      if (!res.ok) throw new Error('Error cargando favoritos');
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFavorites([]);
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

  const getId = (p) => p.id || p.idProducto || p._id;

  const removeFavorite = async (product) => {
    const id = getId(product);
    if (!id) return;
    setRemovingId(id);
    try {
      const res = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setFavorites((prev) => prev.filter((x) => getId(x) !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Comprobando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Tus Favoritos</h1>
        <p className="text-gray-600 text-center max-w-lg">
          No puedes guardar favoritos si no tienes una cuenta. Crea una cuenta o inicia sesión para
          guardar productos y acceder a ellos desde cualquier dispositivo.
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Mis Favoritos</h1>

      {loading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No tienes productos en favoritos.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((p) => {
            const pid = getId(p);
            return (
              <div key={pid || Math.random()} className="relative">
                <ProductCard product={p} />
                <button
                  onClick={() => removeFavorite(p)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                  aria-label="Eliminar favorito"
                  disabled={removingId === pid}
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}