'use client';
import React from 'react';
import { BasicInfoSection } from './BasicInfoSection';

export const BrandForm = ({
  formData,
  errors,
  isSubmitting,
  updateField,
  onSubmit,
  onCancel,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* INFORMACIÓN BÁSICA */}
      <BasicInfoSection
        formData={formData}
        errors={errors}
        updateField={updateField}
      />
      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Marca'}
        </button>
      </div>
    </form>
  );
};