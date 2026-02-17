'use client';
import React from 'react';
import { Package, Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/server/useCategories';

export const SubCategoryForm = ({
  formData, 
  errors, 
  updateField, 
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  // Ordenar categorías alfabéticamente
  const sortedCategories = [...categories].sort((a, b) => 
    (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' })
  );

  const handleSelectNumber = (field) => (e) => {
    const value = e.target.value;
    updateField(field, value === "" ? "" : Number(value));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Package className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Información de la SubCategoría</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nombre de la subcategoría"
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

        {/* Categoría */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors?.idCategoria ? 'border-red-500' : 'border-gray-300'
              } ${loadingCategories ? 'opacity-50' : ''}`}
              value={formData.idCategoria || ""}
              onChange={handleSelectNumber('idCategoria')}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? 'Cargando...' : 'Seleccionar categoría'}
              </option>
              {sortedCategories.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {loadingCategories && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {errors?.idCategoria && (
            <p className="text-red-500 text-sm mt-1">{errors.idCategoria}</p>
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
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};