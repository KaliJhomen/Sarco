'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/hooks/server/useStores';
import { useProductsByStore } from '@/hooks/server/useProducts';
import Loading from '@/components/Loading';
import { ArrowLeft, Edit, ExternalLink } from 'lucide-react';

const StoreDetailsPage = () => {
  const { idStore } = useParams();
  const router = useRouter();
  const { data: store, isLoading: storeLoading, isError: storeError } = useStore(idStore);
  const { data: productsResp, isLoading: productsLoading, isError: productsError } = useProductsByStore(idStore);

  if (storeLoading || productsLoading) return <Loading />;
  if (storeError) return (
    <div className="p-8">
      <p className="text-red-600">Error al cargar la tienda.</p>
    </div>
  );
  if (!store) return (
    <div className="p-8">
      <p className="text-gray-600">Tienda no encontrada.</p>
    </div>
  );

  // productsResp may be axios response or plain array
  const products = Array.isArray(productsResp)
    ? productsResp
    : (productsResp && Array.isArray(productsResp.data) ? productsResp.data : []);

  const condicionText = store.condicion && String(store.condicion) !== '0' ? 'Activo' : 'Inactivo';
  const productosCount = products.length;
  const usuariosCount = store.usuarios?.length ?? 0;
  const ventasCount = store.ventas?.length ?? 0;

  const getCantidadInStore = (product) => {
    if (product.cantidad !== undefined && product.cantidad !== null) return product.cantidad;
    if (product.productoTienda && product.productoTienda.cantidad !== undefined) return product.productoTienda.cantidad;
    if (product.productoTiendas && Array.isArray(product.productoTiendas)) {
      const pt = product.productoTiendas.find(pt => String(pt.idTienda) === String(store.idTienda) || (pt.idTienda === store.idTienda));
      if (pt) return pt.cantidad ?? '-';
    }
    // some APIs return id_producto_tienda or cantidad directly inside an wrapper
    if (product.idProductoTienda && product.cantidadEnTienda !== undefined) return product.cantidadEnTienda;
    return '-';
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-md hover:bg-gray-100"
              title="Volver"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{store.nombre || `Tienda ${store.idTienda}`}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/stores/add-store/${store.idTienda}`)}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              title="Editar tienda"
            >
              <div className="flex items-center gap-2">
                <Edit size={16} /> <span>Editar</span>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Información</h2>
            <dl className="grid grid-cols-1 gap-y-3">
              <div>
                <dt className="text-sm text-gray-500">ID</dt>
                <dd className="text-sm text-gray-900">{store.idTienda}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Nombre</dt>
                <dd className="text-sm text-gray-900">{store.nombre || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Dirección</dt>
                <dd className="text-sm text-gray-900">{store.direccion || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Condición</dt>
                <dd className="text-sm text-gray-900">{condicionText}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Relaciones / Estadísticas</h2>
            <ul className="text-sm text-gray-900 space-y-3">
              <li><strong>Productos (en lista):</strong> {productosCount}</li>
              <li><strong>Usuarios:</strong> {usuariosCount}</li>
              <li><strong>Ventas:</strong> {ventasCount}</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Productos disponibles en la tienda</h2>

          {products.length === 0 ? (
            <p className="text-gray-600">No se encontraron productos para esta tienda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Modelo</th>
                    <th className="px-3 py-2 text-left">Precio</th>
                    <th className="px-3 py-2 text-left">Stock global</th>
                    <th className="px-3 py-2 text-left">Cantidad en tienda</th>
                    <th className="px-3 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {products.map((p) => (
                    <tr key={p.idProducto ?? p.id} className="border-t">
                      <td className="px-3 py-2">{p.idProducto ?? p.id ?? '-'}</td>
                      <td className="px-3 py-2">{p.nombre ?? p.name ?? '-'}</td>
                      <td className="px-3 py-2">{p.modelo ?? '-'}</td>
                      <td className="px-3 py-2">{p.precioVenta !== undefined ? p.precioVenta : (p.precio ? p.precio : '-')}</td>
                      <td className="px-3 py-2">{p.stock ?? '-'}</td>
                      <td className="px-3 py-2">{getCantidadInStore(p)}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => router.push(`/product/${p.idProducto ?? p.id}`)}
                          className="p-1 rounded hover:bg-gray-100"
                          title="Ver producto"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Datos crudos (tienda)</h2>
          <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto text-gray-700">
            {JSON.stringify(store, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsPage;