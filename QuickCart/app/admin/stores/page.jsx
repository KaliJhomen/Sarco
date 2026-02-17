'use client';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useStores, useDeleteStore } from '@/hooks/server/useStores';
import Loading from "@/components/Loading";
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 20;

const StoreListPage = () => {
  const router = useRouter();
  const { data: storesData = [], isLoading: queryLoading, isError } = useStores();
  const deleteMutation = useDeleteStore();

  const [allStores, setAllStores] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    setAllStores(Array.isArray(storesData) ? storesData : []);
    setDisplayedCount(PAGE_SIZE);
    setLoading(queryLoading);
  }, [storesData, queryLoading]);

  useEffect(() => {
    if (loading) return;
    const observerTarget = observerRef.current;
    if (!observerTarget) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => Math.min(prev + PAGE_SIZE, allStores.length));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget);
    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [loading, displayedCount, allStores.length]);

  const handleDelete = async (storeId) => {
    if (!confirm('¿Estás seguro de eliminar esta tienda?')) return;
    const previous = allStores.slice();
    setAllStores(prev => prev.filter(s => s.idTienda !== storeId));
    try {
      await deleteMutation.mutateAsync({ id: storeId });
      toast.success('Tienda eliminada');
    } catch (err) {
      setAllStores(previous);
      toast.error('Error al eliminar la tienda');
    }
  };

  const stores = allStores.slice(0, displayedCount);

  if (isError) return (
    <div className="p-8">
      <p className="text-red-600">Error al cargar tiendas.</p>
    </div>
  );

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Todas las Tiendas ({allStores.length})
          </h1>
          <button
            onClick={() => router.push('/admin/stores/add-store')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Agregar Tienda
          </button>
        </div>

        {(loading || deleteMutation.isLoading) && stores.length === 0 ? (
          <Loading />
        ) : (
          <div className="w-full overflow-x-auto rounded-lg bg-white border border-gray-200 shadow-sm">
            <table className="table-fixed w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm text-left border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Condicion</th>
                  <th className="px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                      No hay tiendas disponibles
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.idTienda} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">{store.nombre}</td>
                      <td className="px-4 py-3">{store.condicion ? 'Activo' : 'Inactivo'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/stores/${store.idTienda}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver tienda"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/stores/add-store/${store.idTienda}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar tienda"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(store.idTienda)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar tienda"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {displayedCount < allStores.length && (
              <div ref={observerRef} className="py-6 flex justify-center">
                <span className="text-blue-600">Desliza para cargar más...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreListPage;