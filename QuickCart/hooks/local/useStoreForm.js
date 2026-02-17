'use client';
import { useState } from 'react';

export const useStoreForm = () => {
  const initialFormData = {
    nombre: '',
    direccion: '',
    telefono: '',
    estado: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nombre?.trim()) errs.nombre = 'El nombre es requerido';
    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) errs.telefono = 'Teléfono inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
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