'use client';
import React from 'react';
import { Package } from 'lucide-react';

export const BasicInfoSection = ({ formData, errors, updateField }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Package className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Título del anuncio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del anuncio <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.titulo ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.titulo || ''}
            onChange={(e) => updateField('titulo', e.target.value)}
          />
          {errors?.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
        </div>

        {/* URL de imagen */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de imagen <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.imagen ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.imagen || ''}
            onChange={(e) => updateField('imagen', e.target.value)}
          />
          {errors?.imagen && <p className="text-red-500 text-sm mt-1">{errors.imagen}</p>}
        </div>

        {/* URL de destino */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de destino (opcional)
          </label>
          <input
            type="url"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.urlDestino ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.urlDestino || ''}
            onChange={(e) => updateField('urlDestino', e.target.value)}
          />
          {errors?.urlDestino && (
            <p className="text-red-500 text-sm mt-1">{errors.urlDestino}</p>
          )}
        </div>

        {/* Orden de aparición */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orden de aparición
          </label>
          <input
            type="number"
            min="0"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.orden ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.orden ?? 0}
            onChange={(e) => updateField('orden', Number(e.target.value))}
          />
          {errors?.orden && <p className="text-red-500 text-sm mt-1">{errors.orden}</p>}
        </div>

        {/* Estado */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              checked={formData.estado ?? true}
              onChange={(e) => updateField('estado', e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>
        </div>
      </div>
    </div>
  );
};