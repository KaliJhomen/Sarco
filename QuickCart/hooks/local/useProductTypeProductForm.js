'use client';
import { useState} from 'react';

export const useProductTypeProductForm = () => {
  const initialFormData = {
    idProducto: '',
    idTipoProducto: '',
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
return {
    formData,
    errors,
    isSubmitting,
    updateField,
}
}