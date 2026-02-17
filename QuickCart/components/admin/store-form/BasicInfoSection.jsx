'use client';
import React from 'react';
import { MapPin, Phone } from 'lucide-react';


export const BasicInfoSection = ({ formData, errors, updateField }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-5">
        <MapPin className="text-green-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Tienda <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nombre de la tienda"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
              errors?.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.nombre || ''}
            onChange={(e) => updateField('nombre', e.target.value)}
          />
          {errors?.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
          <input
            type="text"
            placeholder="Dirección de la tienda"
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none border-gray-300"
            value={formData.direccion || ''}
            onChange={(e) => updateField('direccion', e.target.value)}
          />
        </div>
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
              checked={formData.condicion ?? true}
              onChange={(e) => updateField('estado', e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>
        </div>
      </div>
    </div>
  );
};