'use client';
import { useState } from 'react';
import { validateBrandForm } from '@/utils/helpers/brandValidators';

export const useBrandForm = () => {
  const initialFormData = {
    nombre: '',  
    estado: true,   
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
    const validation = validateBrandForm({
      nombre: formData.nombre,
      estado: formData.estado,
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    setFormData, 
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validate,
    resetForm,
  };
};