'use client';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { brandService } from '@/services/brand.service';
import Loading from "@/components/Loading";
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Search from "@/components/admin/product-list/Search";

const PAGE_SIZE = 20;

const BrandListPage = () => {
  const router = useRouter();
  const [allBrands, setAllBrands] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  // Fetch all brands once
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const result = await brandService.getAll(); // Sin paginación, trae todos
      setAllBrands(result);
    } catch (error) {
      toast.error('Error al cargar marcas');
      setAllBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Intersection Observer for lazy loading local
  useEffect(() => {
    if (loading) return;
    const observerTarget = observerRef.current;
    if (!observerTarget) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => Math.min(prev + PAGE_SIZE, allBrands.length));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget);

    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [loading, displayedCount, allBrands.length]);

  const handleDelete = async (brandId) => {
    if (confirm('¿Estás seguro de eliminar esta marca?')) {
      setAllBrands(allBrands.filter(b => b.idMarca !== brandId));
      toast.success('Marca eliminada (simulación)');
    }
  };

  const brands = allBrands.slice(0, displayedCount);
  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Todas las Marcas ({allBrands.length})
          </h1>
          <button
            onClick={() => router.push('/admin/storage/brands/add-brand')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Agregar Marca
          </button>
        </div>

        {loading && brands.length === 0 ? (
          <Loading />
        ) : (
          <div className="w-full overflow-x-auto rounded-lg bg-white border border-gray-200 shadow-sm">
            <table className="table-fixed w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm text-left border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Acciones</th>

                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                      No hay marcas disponibles
                    </td>
                  </tr>
                ) : (
                  brands.map((brand, index) => (
                    <tr key={brand.idMarca} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">{brand.nombre}</td>
                      <td className="px-4 py-3">{brand.estado ? 'Activo' : 'Inactivo'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/brand/${brand.idMarca}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver marca"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/storage/brands/add-brand/${brand.idMarca}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar marca"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(brand.idMarca)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar marca"
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
            {/* Lazy loading trigger */}
            {displayedCount < allBrands.length && (
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

export default BrandListPage;