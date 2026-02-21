'use client';
import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';

export default function UserPage() {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-600">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">No estás autenticado.</p>
          <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  console.log('Datos del usuario desde AuthContext:', user);

  const getImage = () => user.imagen ? `/productos/${user.imagen}` : '/productos/placeholder.svg';
  const cargo = user.nombre || 'No especificado'; // Cambiado de idCargo2 a cargo
  const email = user.email || 'No especificada'; // Cambiado de idTienda2 a tienda
  const rol = user.rol || 'No especificada';
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi cuenta</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 flex gap-6 items-start">
        {/* Imagen del usuario */}
        <div className="w-28 h-28 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
          <Image
            src={getImage()}
            alt={`Imagen de perfil de ${user.nombre || 'Usuario'}`}
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Información del usuario */}
        <div className="flex-1">
          <div className="text-2xl font-semibold text-gray-800">{user.nombre || 'Usuario'}</div>
          {user.role && <div className="text-sm text-gray-500 mb-4 capitalize">{user.role}</div>}

          <div className="grid grid-cols-1 gap-4 text-sm">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Rol" value={rol} />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-all"
        >
          Cerrar sesión
        </button>
        <Link
          href="/admin/user/edit"
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-all"
        >
          Editar perfil
        </Link>
        <Link
          href="/admin"
          className="px-6 py-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700 transition-all"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <div className="text-gray-600">{label}:</div>
      <div className="font-medium text-gray-800">{value || 'No especificado'}</div>
    </div>
  );
}