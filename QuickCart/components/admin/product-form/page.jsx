'use client';
import React, { useState, useEffect } from 'react';
import { BasicInfoSection } from './BasicInfoSection';
import { PricingSection } from './PricingSection';
import { WarrantySection } from './WarrantySection';
import { calculateFinalPrice } from '@/utils/helpers/calculators';

export const ProductForm = ({
  formData,
  errors,
  isSubmitting,
  updateField,
  onSubmit,
  onCancel,
  stockTotal,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showColors, setShowColors] = useState(Array.isArray(formData.colores) && formData.colores.length > 0);

  const precioFinal = calculateFinalPrice(formData.precioVenta, formData.descuento);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(e);
    if (result === true) {
      setShowSuccessModal(true);
    }
  };

  // Actualiza showColors si cambia formData.colores
  useEffect(() => {
    setShowColors(Array.isArray(formData.colores) && formData.colores.length > 0);
  }, [formData.colores]);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* INFORMACIÓN BÁSICA */}
        <BasicInfoSection
          formData={formData}
          errors={errors}
          updateField={updateField}
        />

        {/* PRECIOS Y DESCUENTO */}
        <PricingSection
          formData={formData}
          errors={errors}
          updateField={updateField}
          precioTope={formData.precioTope}
          precioVenta={formData.precioVenta}
          precioFinal={precioFinal}
        />

        {/* GARANTÍA Y FINANCIAMIENTO */}
        <WarrantySection
          formData={formData}
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
            {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </form>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">¡Producto Agregado Correctamente!</h2>
            <p className="mb-6 text-gray-700">El producto se ha guardado en la base de datos.</p>
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