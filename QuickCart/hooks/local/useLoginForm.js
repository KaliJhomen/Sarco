import { useState } from 'react';
import { useAuth } from '@/hooks/server/useAuth';

export const useLoginForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(
      formData.email, 
      formData.password, 
      formData.rememberMe
    );

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit
  };
};