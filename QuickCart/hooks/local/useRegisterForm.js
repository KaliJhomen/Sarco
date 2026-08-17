import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/server/useAuth';

export const useRegisterForm = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    clave: '',
    confirmClave: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono debe tener 9 dígitos';
    }

    if (!formData.clave) {
      newErrors.clave = 'La contraseña es requerida';
    } else if (formData.clave.length < 8) {
      newErrors.clave = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.clave)) {
      newErrors.clave = 'Debe contener mayúscula, minúscula y número';
    }

    if (formData.clave !== formData.confirmClave) {
      newErrors.confirmClave = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    const result = await register({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono || null,
      clave: formData.clave
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setIsExiting(true), 2000);
      setTimeout(() => router.push('/auth/login'), 2500);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return {
    formData,
    errors,
    error,
    loading,
    success,
    isExiting,
    handleChange,
    handleSubmit
  };
};