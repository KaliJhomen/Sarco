'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { cliente, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState('info');
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated]);

  if (loading) return <div className="p-6">Cargando perfil...</div>;
  if (!cliente) return null;

  const menu = [
    { id: 'info', label: 'Tu Información' },
    { id: 'account', label: 'Datos de la Cuenta' },
    { id: 'security', label: 'Seguridad' },
    { id: 'cards', label: 'Tarjetas' },
    { id: 'address', label: 'Direcciones' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
              {cliente.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{cliente.name}</p>
              <p className="text-sm text-gray-500">{cliente.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`text-left px-3 py-2 rounded-xl transition ${
                  active === item.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow p-6">

          {/* TU INFORMACIÓN */}
          {active === 'info' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Tu Información</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Nombre" value={cliente.name} />
                <InfoItem label="Email" value={cliente.email} />
                <InfoItem label="Teléfono" value={cliente.phone} />
                <InfoItem label="Documento" value={cliente.documentNumber} />
              </div>
            </div>
          )}

          {/* DATOS DE CUENTA */}
          {active === 'account' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Datos de la Cuenta</h2>

              <div className="space-y-3">
                <InfoItem label="ID Usuario" value={cliente.id} />
                <InfoItem label="Correo" value={cliente.email} />
              </div>
            </div>
          )}

          {/* SEGURIDAD */}
          {active === 'security' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Seguridad</h2>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                Cambiar contraseña
              </button>
            </div>
          )}

          {/* TARJETAS */}
          {active === 'cards' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Tarjetas</h2>

              <p className="text-gray-500">No tienes tarjetas registradas</p>

              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl">
                Agregar tarjeta
              </button>
            </div>
          )}

          {/* DIRECCIONES */}
          {active === 'address' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Direcciones</h2>

              <InfoItem label="Dirección" value={cliente.address} />
              <InfoItem label="Referencia" value={cliente.reference} />

              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl">
                Editar dirección
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* COMPONENTE REUTILIZABLE */
function InfoItem({ label, value }) {
  return (
    <div className="bg-gray-50 p-3 rounded-xl">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || 'No registrado'}</p>
    </div>
  );
}