'use client';
import React, { useState, useEffect } from 'react';
import { BasicInfoSection } from './BasicInfoSection';

export const CategoryForm = ({
  formData,
  errors,
  isSubmitting,
  updateField,
  onSubmit,
  onCancel,
  idCategoria,
  categoryService,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showColors, setShowColors] = useState(formData.colores && formData.colores.length > 0);
  const [categoriaId, setCategoriaId] = useState('');
  const [subcategorias, setSubcategorias] = useState([]);
  const [subcategoriaId, setSubcategoriaId] = useState('');

  const precioFinal = calculateFinalPrice(formData.precioVenta, formData.descuento);
  /*const cuotaMensual = calculateMonthlyPayment(precioFinal, formData.mesesSinInteres);
*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Intentando guardar producto...');
    const result = await onSubmit(e);
    const token = localStorage.getItem('token');
    console.log('Resultado de onSubmit:', result);
    if (result === true) {
      setShowSuccessModal(true);
    }
  };

  // Nuevo: función para agregar el primer color y mostrar la sección
  const handleAddFirstColor = () => {
    addColor();
    setShowColors(true);
  };
  /*

  const handleCategoriaChange = async (e) => {
    const id = e.target.value;
    setCategoriaId(id);
    setSubcategorias([]);
    setSubcategoriaId('');

    if (id) {
      const subs = await fetch(`/api/subcategorias?categoriaId=${id}`).then(res => res.json());
      setSubcategorias(subs);
    }
  };
*/
  useEffect(() => {
    if (formData.colores.length === 0) {
      setShowColors(false);
    }
  }, [formData.colores]);

  useEffect(() => {
    if (idProducto) {
      productService.getById(idProducto)
        .then(data => {
          setFormData({
            ...data,
            colores: Array.isArray(data.colores) ? data.colores : [],
          });
        })
        .finally(() => setLoading(false));
    }
  }, [idProducto, productService]);
  
  const safeFormData = {
    ...formData,
    colores: Array.isArray(formData?.colores) ? formData.colores : [],
  };

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