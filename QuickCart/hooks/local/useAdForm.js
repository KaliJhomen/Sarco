'use client';
import { useState } from 'react';
import { validateAdForm } from '@/utils/helpers/adValidators';

export const useAdForm = () => {
  const initialFormData = {
    titulo: '',
    imagen: '',
    urlDestino: '',
    orden: 0,
    estado: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const validation = validateAdForm(formData);
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