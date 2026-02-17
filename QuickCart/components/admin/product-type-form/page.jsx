'use client';
import React from 'react';
import { Package, Loader2 } from 'lucide-react';
import { useSubCategories } from '@/hooks/server/useSubCategories';
import { useAuth } from "@/hooks/server/useAuth";

export const ProductTypeForm = ({
  formData, 
  errors, 
  updateField, 
  onSubmit,
  onCancel
}) => {
  const { data: subCategories = [], isLoading: loadingSubCategories } = useSubCategories();

  const handleSubCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    updateField('idSubCategorias', selectedOptions);
  };
//Ordenar subcategorias alfabéticamente
  const sortedSubCategories = [...subCategories].sort((a, b) => 
    (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' })
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Package className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Información del Tipo de Producto</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nombre del tipo de producto"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.nombre || ''}
            onChange={(e) => updateField('nombre', e.target.value)}
          />
          {errors?.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Sub-Categorías (Selección múltiple) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-Categorías <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              multiple
              size={5}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors?.idSubCategorias ? 'border-red-500' : 'border-gray-300'
              } ${loadingSubCategories ? 'opacity-50' : ''}`}
              value={formData.idSubCategorias || []}
              onChange={handleSubCategoryChange}
              disabled={loadingSubCategories}
            >
              {loadingSubCategories ? (
                <option disabled>Cargando...</option>
              ) : (
                sortedSubCategories.map((subCategoria) => (
                  <option key={subCategoria.idSubCategoria} value={subCategoria.idSubCategoria}>
                    {subCategoria.nombre}
                  </option>
                ))
              )}
            </select>
            {loadingSubCategories && (
              <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Mantén presionado Ctrl para seleccionar múltiples opciones (Opcional)
          </p>
          {errors?.idSubCategorias && (
            <p className="text-red-500 text-sm mt-1">{errors.idSubCategorias}</p>
          )}
        </div>

        {/* Estado */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              checked={formData.estado || false}
              onChange={(e) => updateField('estado', e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex gap-3 mt-6">
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};