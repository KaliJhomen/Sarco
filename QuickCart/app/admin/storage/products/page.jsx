'use client';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/server/useProducts';
import Loading from "@/components/Loading";
import Image from "next/image";
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/helpers/formatters';
import Search from "@/components/admin/product-list/Search";

const PAGE_SIZE = 20;

const ProductListPage = () => {
  const router = useRouter();
  const { data: allProducts = [], isLoading } = useProducts();
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading local
  useEffect(() => {
    if (isLoading) return;
    const observerTarget = observerRef.current;
    if (!observerTarget) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => Math.min(prev + PAGE_SIZE, allProducts.length));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget);

    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [isLoading, displayedCount, allProducts.length]);

  const handleDelete = async (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setAllProducts(allProducts.filter(p => p.idProducto !== productId));
      toast.success('Producto eliminado (simulación)');
    }
  };

  const products = allProducts.slice(0, displayedCount);

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Todos los Productos ({allProducts.length})
          </h1>
          <button
            onClick={() => router.push('/admin/storage/products/add/product')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Agregar Producto
          </button>
        </div>

        {isLoading && products.length === 0 ? (
          <Loading />
        ) : (
          <div className="w-full overflow-x-auto rounded-lg bg-white border border-gray-200 shadow-sm">
            <table className="table-fixed w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm text-left border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Marca</th>
                  <th className="px-4 py-3 font-semibold">Categoria</th>
                  <th className="px-4 py-3 font-semibold">Modelo</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Imagen</th>
                  <th className="px-4 py-3 font-semibold">Precio Tope</th>
                  <th className="px-4 py-3 font-semibold">Precio de Venta</th>
                  <th className="px-4 py-3 font-semibold">Fecha Ingreso</th>
                  <th className="px-4 py-3 font-semibold">Garantia</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                      No hay productos disponibles
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.idProducto} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">{product.nombre}</td>
                      <td className="px-4 py-3">{product.marca?.nombre || 'N/A'}</td>
                      <td className="px-4 py-3">{product.categoria?.nombre || 'N/A'}</td>
                      <td className="px-4 py-3">{product.modelo}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                          <Image
                            src={product.imagen ? `/articulos/${product.imagen}` : '/no-image.png'}
                            alt={product.nombre}
                            width={64}
                            height={64}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">{formatPrice(product.precioTope)}</td>
                      <td className="px-4 py-3">{formatPrice(product.precioVenta)}</td>
                      <td className="px-4 py-3">{product.fechaIngreso}</td>
                      <td className="px-4 py-3">{product.garantiaFabrica ?? '-'}</td>
                      <td className="px-4 py-3">{product.estado ? 'Activo' : 'Inactivo'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/product/${product.idProducto}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver producto"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/storage/products/add/product/${product.idProducto}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar producto"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.idProducto)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar producto"
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
            {displayedCount < allProducts.length && (
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

export default ProductListPage;