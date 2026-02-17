'use client';
import React, { useState, useEffect } from 'react';
import { BasicInfoSection } from './BasicInfoSection';

export const StoreForm = ({
  formData,
  errors,
  isSubmitting,
  updateField,
  onSubmit,
  onCancel,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(e);
    if (result === true) {
      setShowSuccessModal(true);
    }
  };
  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection formData={formData} errors={errors} updateField={updateField} />

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
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Tienda'}
        </button>
      </div>
    </form>
    {showSuccessModal && (  
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">¡Tienda Agregada Correctamente!</h2>
          <p className="mb-6 text-gray-700">La tienda se ha guardado en la base de datos.</p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={() => setShowSuccessModal(false)}
          >
            Cerrar
          </button>
        </div>
      </div>
    )}
  </>
  );

};      