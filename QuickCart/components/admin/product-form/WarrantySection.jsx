'use client';
import React from 'react';
import { Shield } from 'lucide-react';

export const WarrantySection = ({
  formData,
  updateField,
}) => {
  const handleCheck = (e) => {
    if (e.target.checked) {
      updateField('garantiaFabrica', null); 
      updateField('sinGarantia', true);
    } else {
      updateField('sinGarantia', false);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    // Limitar a 3 dígitos
    if (value.length > 3) value = value.slice(0, 3);
    // Solo permitir enteros positivos
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      updateField('garantiaFabrica', value === '' ? '' : Number(value));
    }
  };

  const meses = parseInt(formData.garantiaFabrica, 10);
  const mostrarAnios = !isNaN(meses) && meses >= 12;
  let conversion = null;
  if (mostrarAnios) {
    const anios = Math.floor(meses / 12);
    const restoMeses = meses % 12;
    conversion = `${anios} año${anios > 1 ? 's' : ''}${restoMeses > 0 ? ` y ${restoMeses} mes${restoMeses > 1 ? 'es' : ''}` : ''}`;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Shield className="text-purple-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Garantía</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Garantía */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={2}
            max={999}
            step={1}
            maxLength={3}
            className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.garantiaFabrica || ''}
            onChange={handleChange}
            disabled={formData.sinGarantia}
            placeholder="Meses"
          />
          <span>meses</span>
          <label className="flex items-center gap-2 ml-4">
            <input
              type="checkbox"
              checked={!!formData.sinGarantia}
              onChange={handleCheck}
            />
            Sin garantía
          </label>
          {conversion && (
            <span className="ml-4 text-gray-500">
              ({conversion})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};