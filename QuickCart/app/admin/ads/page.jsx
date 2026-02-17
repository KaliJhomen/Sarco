'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAds, useDeleteAd } from '@/hooks/server/useAds';
import { Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

const AnunciosPage = () => {
  const router = useRouter();
  const { data: anuncios = [] } = useAds();
  const deleteAd = useDeleteAd();

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este anuncio?')) {
      deleteAd.mutate({ id, token: 'tu_token' });
      toast.success('Anuncio eliminado');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestionar Anuncios</h1>
          <button
            onClick={() => router.push('/admin/ads/add-ad')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Crear Anuncio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anuncios.map((anuncio) => (
            <div key={anuncio.idAnuncio} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-40 w-full">
                <Image
                  src={anuncio.imagen}
                  alt={anuncio.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{anuncio.titulo}</h3>
                <p className="text-sm text-gray-600 mb-3">{anuncio.descripcion}</p>
                <p className="text-xs text-blue-600 mb-4 truncate">{anuncio.urlDestino}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/ads/add-ad/${anuncio.idAnuncio}`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(anuncio.idAnuncio)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnunciosPage;