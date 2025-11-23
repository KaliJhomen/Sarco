'use client';
import { useState, useMemo } from 'react';
import { validateCategoryForm } from '@/utils/helpers/categoryValidators';

export const useCategoryForm = () => {
  const initialFormData = {
    // Campos básicos del producto
    idSubCategorias:[],
    nombre: '',     
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
    const validation = validateCategoryForm({
      nombre: formData.nombre,
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      // Relaciones (IDs)
      SubCategorias: [],
    });
    setErrors({});
  };

  const onSubmit = async (e, { onSuccess, onError }) => {
    if (guardadoExitoso) {
      onSuccess && onSuccess();
      return true;
    } else {
      onError && onError();
      return false;
    }
  };

  return {
    formData,
    errors,
    onSubmit,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validate,
    resetForm,
  };
};