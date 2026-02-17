'use client';
import { useState } from 'react';

export const useProductTypeForm = () => {
  const initialFormData = {
    // Campos básicos del tipo producto
    nombre: '',
    estado: true,
    idSubCategorias: [], 
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre || formData.nombre.trim() === '') {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.idSubCategorias || formData.idSubCategorias.length === 0) {
      newErrors.idSubCategorias = 'Debe seleccionar al menos una subcategoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    setFormData,
    setIsSubmitting,
    updateField,
    validate,
    resetForm,
  };
};