'use client';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useProductTypes, useDeleteProductType } from '@/hooks/server/useProductTypes';
import { useAuth } from "@/hooks/server/useAuth";
import Loading from "@/components/Loading";
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 20;

const ProductTypesListPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { data: allProductTypes = [], isLoading } = useProductTypes();
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const observerRef = useRef(null);
  const { mutate: deleteProductType } = useDeleteProductType();

  // Intersection Observer for lazy loading local
  useEffect(() => {
    if (isLoading) return;
    const observerTarget = observerRef.current;
    if (!observerTarget) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => Math.min(prev + PAGE_SIZE, allProductTypes.length));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget);

    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [isLoading, displayedCount, allProductTypes.length]);

  const handleDelete = async (productTypeId) => {
    if (confirm('¿Estás seguro de eliminar este tipo de producto?')) {
      deleteProductType(
        { id: productTypeId, token },
        {
          onSuccess: () => {
            toast.success('Tipo de producto eliminado exitosamente');
          },
          onError: (error) => {
            const errorMessage = error?.response?.data?.message || 'Error al eliminar';
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const productTypes = allProductTypes.slice(0, displayedCount);

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Todos los Tipos de Productos ({allProductTypes.length})
          </h1>
          <button
            onClick={() => router.push('/admin/storage/product-types/add-product-type')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Agregar Tipo de Producto
          </button>
        </div>

        {isLoading && productTypes.length === 0 ? (
          <Loading />
        ) : (
          <div className="w-full overflow-x-auto rounded-lg bg-white border border-gray-200 shadow-sm">
            <table className="table-fixed w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm text-left border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Sub Categoría</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {productTypes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No hay tipos de producto disponibles
                    </td>
                  </tr>
                ) : (
                  productTypes.map((productType) => (
                    <tr key={productType.idTipoProducto} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">{productType.nombre}</td>
                      <td className="px-4 py-3">
                        {productType.tipoProductoSubCategoria?.map(t => t.idSubCategoria?.nombre).join(', ') || 'N/A'}
                      </td>
                      <td className="px-4 py-3">{productType.estado ? 'Activo' : 'Inactivo'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/storage/product-types/${productType.idTipoProducto}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver tipo de producto"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/storage/product-types/add-product-type/${productType.idTipoProducto}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar tipo de producto"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(productType.idTipoProducto)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar tipo de producto"
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
            {displayedCount < allProductTypes.length && (
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

export default ProductTypesListPage;