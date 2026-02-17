'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/services/api/client';
import { useCreateClient } from '@/hooks/server/useClients';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AddClientPage() {
  const router = useRouter();
  const createClient = useCreateClient();

  const [form, setForm] = useState({
    nombre: '',
    idDocumento: '',
    numeroDocumento: '',
    direccion: '',
    referencia: '',
    direccionDni: '',
    telefono: '',
    email: '',
    idEstadoCliente: '',
  });

  const [docs, setDocs] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadMeta() {
      try {
        const [dRes, eRes] = await Promise.all([
          client.get('/documento'),
          client.get('/estado-cliente'),
        ]);
        if (!mounted) return;
        setDocs(dRes.data || []);
        const estadosData = eRes.data || [];
        setEstados(estadosData);

        // set default estado to "Regular" if exists (case-insensitive)
        const regular = estadosData.find(s => s.nombre && s.nombre.toLowerCase().includes('regular'));
        if (regular) {
          setForm(prev => ({ ...prev, idEstadoCliente: String(regular.idEstado) }));
        }
      } catch (err) {
        console.error(err);
        toast.error('Error cargando tipos de documento / estados');
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    }
    loadMeta();
    return () => { mounted = false; };
  }, []);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    if (!form.nombre || !form.numeroDocumento) {
      toast.error('Nombre y número de documento son obligatorios');
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      nombre: form.nombre || null,
      idDocumento: form.idDocumento ? Number(form.idDocumento) : undefined,
      numeroDocumento: form.numeroDocumento || null,
      direccion: form.direccion || null,
      referencia: form.referencia || null,
      direccionDni: form.direccionDni || null,
      telefono: form.telefono || null,
      email: form.email || null,
      idEstadoCliente: form.idEstadoCliente ? Number(form.idEstadoCliente) : undefined,
    };

    try {
      await createClient.mutateAsync(payload);
      toast.success('Cliente creado');
      router.push('/admin/misc/clients');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Error creando cliente');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Añadir cliente</h1>
        <Link href="/admin/misc/clients" className="text-sm text-gray-600 hover:underline">Volver a clientes</Link>
      </div>

      <form onSubmit={onSubmit} className="bg-white shadow rounded p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre</label>
          <input value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-700">Tipo documento</label>
            <select value={form.idDocumento} onChange={e => handleChange('idDocumento', e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="">— Seleccionar —</option>
              {docs.map(d => <option key={d.idDocumento} value={d.idDocumento}>{d.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">N° documento</label>
            <input value={form.numeroDocumento} onChange={e => handleChange('numeroDocumento', e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Estado</label>
            <select value={form.idEstadoCliente} onChange={e => handleChange('idEstadoCliente', e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="">— Seleccionar —</option>
              {estados.map(s => <option key={s.idEstado} value={s.idEstado}>{s.nombre}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Dirección</label>
          <input value={form.direccion} onChange={e => handleChange('direccion', e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Referencia</label>
          <input value={form.referencia} onChange={e => handleChange('referencia', e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Dirección DNI</label>
          <input value={form.direccionDni} onChange={e => handleChange('direccionDni', e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700">Teléfono (opcional)</label>
            <input value={form.telefono} onChange={e => handleChange('telefono', e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Email (opcional)</label>
            <input value={form.email} onChange={e => handleChange('email', e.target.value)} type="email" className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" disabled={createClient.isLoading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
            {createClient.isLoading ? 'Guardando...' : 'Crear cliente'}
          </button>
          <Link href="/admin/misc/clients" className="px-4 py-2 border rounded text-sm">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}