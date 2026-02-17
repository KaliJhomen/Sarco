'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useClients, useDeleteClient } from '@/hooks/server/useClients';

export default function ClientsPage() {
  const [params, setParams] = useState({ page: 1, limit: 25, q: '' });
  const { data: resp, isLoading, isError } = useClients(params);
  const deleteMutation = useDeleteClient();

  const clients = useMemo(() => (resp?.data ?? []), [resp]);
  const meta = resp?.meta ?? { total: 0, page: 1, limit: 25, totalPages: 1 };

  const handleSearch = (e) => {
    setParams((p) => ({ ...p, q: e.target.value, page: 1 }));
  };

  const goPage = (newPage) => setParams((p) => ({ ...p, page: newPage }));

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar cliente?')) return;
    await deleteMutation.mutateAsync(id);
  };

  if (isLoading) return <div className="p-6">Cargando clientes...</div>;
  if (isError) return <div className="p-6 text-red-600">Error cargando clientes</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Clientes registrados</h1>
        <div className="flex gap-2">
          <Link href="/admin/misc/clients/add-client" className="px-4 py-2 bg-blue-600 text-white rounded">Nuevo cliente</Link>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <input
          placeholder="Buscar por nombre, documento, email, teléfono..."
          value={params.q}
          onChange={handleSearch}
          className="w-full md:w-1/2 px-3 py-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Documento</th>
              <th className="p-2 text-left">Dirección</th>
              <th className="p-2 text-left">Teléfono</th>
              <th className="p-2 text-left">Estado</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">No hay clientes</td>
              </tr>
            )}
            {clients.map((c) => (
              <tr key={c.idCliente} className="border-t hover:bg-gray-50">
                <td className="p-2">{c.idCliente}</td>
                <td className="p-2">{c.nombre ?? '-'}</td>
                <td className="p-2">{c.numeroDocumento ?? '-'}</td>
                <td className="p-2">{c.direccion ?? '-'}</td>
                <td className="p-2">{c.telefono ?? '-'}</td>
                <td className="p-2">{c.idEstadoCliente2?.nombre ?? '-'}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Link href={`/admin/misc/clients/${c.idCliente}`} className="px-2 py-1 text-sm bg-green-600 text-white rounded">Ver</Link>
                    <Link href={`/admin/misc/clients/edit/${c.idCliente}`} className="px-2 py-1 text-sm bg-blue-600 text-white rounded">Editar</Link>
                    <button onClick={() => handleDelete(c.idCliente)} className="px-2 py-1 text-sm bg-red-600 text-white rounded">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando página {meta.page} de {meta.totalPages} — {meta.total} clientes
        </div>
        <div className="flex items-center gap-2">
          <button disabled={meta.page <= 1} onClick={() => goPage(meta.page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
          <button disabled={meta.page >= meta.totalPages} onClick={() => goPage(meta.page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
}