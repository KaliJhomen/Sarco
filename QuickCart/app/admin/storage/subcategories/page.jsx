'use client';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { subCategoryService } from '@/services/subCategory.service';
import Loading from "@/components/Loading";
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Search from "@/components/admin/product-list/Search";

const PAGE_SIZE = 20;

const SubCategoryListPage = () => {
  const router = useRouter();
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  // Fetch all subcategories once
  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const result = await subCategoryService.getAll();
      setAllSubCategories(result);
    } catch (error) {
      toast.error('Error al cargar subcategorías');
      setAllSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading) return;
    const observerTarget = observerRef.current;
    if (!observerTarget) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => Math.min(prev + PAGE_SIZE, allSubCategories.length));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget);

    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [loading, displayedCount, allSubCategories.length]);

  const handleDelete = async (subCategoryId) => {
    if (confirm('¿Estás seguro de eliminar esta subcategoría?')) {
      setAllSubCategories(allSubCategories.filter(s => s.idSubCategoria !== subCategoryId));
      toast.success('Subcategoría eliminada (simulación)');
    }
  };

  const subCategories = allSubCategories.slice(0, displayedCount);

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Todas las SubCategorías ({allSubCategories.length})
          </h1>
          <button
            onClick={() => router.push('/admin/storage/subcategories/add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Agregar SubCategoría
          </button>
        </div>

        {loading && subCategories.length === 0 ? (
          <Loading />
        ) : (
          <div className="w-full overflow-x-auto rounded-lg bg-white border border-gray-200 shadow-sm">
            <table className="table-fixed w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm text-left border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Categoría</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {subCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No hay SubCategorías disponibles
                    </td>
                  </tr>
                ) : (
                  subCategories.map((subCategory) => (
                    <tr key={subCategory.idSubCategoria} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">{subCategory.nombre}</td>

                      <td className="px-4 py-3">{subCategory.idCategoria2?.nombre || 'Sin categoría'}</td>
                      <td className="px-4 py-3">{subCategory.estado ? 'Activo' : 'Inactivo'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/subcategory/${subCategory.idSubCategoria}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver subcategoría"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/storage/subcategories/add/${subCategory.idSubCategoria}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar Sub Categoría"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(subCategory.idSubCategoria)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar subcategoría"
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
            {displayedCount < allSubCategories.length && (
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

export default SubCategoryListPage;