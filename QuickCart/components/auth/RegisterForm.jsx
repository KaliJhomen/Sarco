'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Phone, IdCard } from 'lucide-react';
import AuthHeader from './AuthHeader';
import { assets } from '@/assets/assets';
import { authService } from '@/services/auth.service';

export const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    numeroDocumento: '',
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
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    else if (formData.nombre.length < 3) newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'El correo es requerido';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Correo electrónico inválido';

    if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) newErrors.telefono = 'Ingrese un número de teléfono válido';

    if (!formData.clave) newErrors.clave = 'La contraseña es requerida';
    else if (formData.clave.length < 8) newErrors.clave = 'La contraseña debe tener al menos 8 caracteres';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.clave)) newErrors.clave = 'Debe contener mayúscula, minúscula y número';

    if (formData.clave !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        clave: formData.clave,
        numeroDocumento: formData.numeroDocumento,
        telefono: formData.telefono
      };

      const result = await authService.register(payload);

      if (!result.success) {
        throw new Error(result.error || 'Error al crear la cuenta');
      }

      setSuccess(true);
      setTimeout(() => setIsExiting(true), 2000);
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  // Password strength helper (unchanged)
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { level: 0, text: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    const levels = [
      { level: 1, text: 'Muy débil', color: 'bg-red-500' },
      { level: 2, text: 'Débil', color: 'bg-orange-500' },
      { level: 3, text: 'Media', color: 'bg-yellow-500' },
      { level: 4, text: 'Fuerte', color: 'bg-green-500' },
      { level: 5, text: 'Muy fuerte', color: 'bg-green-600' }
    ];
    return levels[strength - 1] || { level: 0, text: '', color: '' };
  };

  const passwordStrength = getPasswordStrength();

  if (success) {
    return (
      <div className={`w-full max-w-md transition-all duration-500 ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
        <div className={`bg-white rounded-2xl shadow-xl p-8 text-center transition-all duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${isExiting ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
            <CheckCircle2 className="text-green-600 animate-bounce" size={40} />
          </div>
          <h2 className={`text-2xl font-bold text-gray-900 mb-2 transition-all duration-500 delay-100 ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            ¡Cuenta creada!
          </h2>
          <p className={`text-gray-600 mb-6 transition-all duration-500 delay-200 ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            Tu cuenta ha sido creada exitosamente.
          </p>
          <div className={`flex justify-center transition-all duration-500 delay-300 ${isExiting ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
            <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          </div>
          <p className={`text-sm text-gray-500 mt-4 transition-all duration-500 delay-400 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            Redirigiendo al login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
        <AuthHeader
          title="Crear cuenta"
          subtitle=""
          logoSrc={assets.logo}
        />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-shake">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="animate-slide-up animation-delay-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" size={20} />
              <input
                type="text"
                required
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 ${errors.nombre ? 'border-red-500 shake' : 'border-gray-300'}`}
                value={formData.nombre}
                placeholder= "Correo"
                onChange={(e) => handleChange('nombre', e.target.value)}
              />
            </div>
            {errors.nombre && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.nombre}</p>}
          </div>

          <div className="animate-slide-up animation-delay-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.email}
                placeholder= "Email"
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.email}</p>}
          </div>

          <div className="animate-slide-up animation-delay-400">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder= "Teléfono"
                maxLength="9"
              />
            </div>
            {errors.telefono && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.telefono}</p>}
          </div>

          <div className="animate-slide-up animation-delay-400">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numero de DNI <span className="text-gray-400 text-xs"></span>
            </label>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="id"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 ${errors.numeroDocumento ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.numeroDocumento}
                onChange={(e) => handleChange('numeroDocumento', e.target.value)}
                placeholder= "Número de Documento"
                maxLength="9"
              />
            </div>
            {errors.numeroDocumento && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.numeroDocumento}</p>}
          </div>

          <div className="animate-slide-up animation-delay-500">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'clave'}
                required
                className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 ${errors.clave ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.clave}
                placeholder= "Contraseña"
                onChange={(e) => handleChange('clave', e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.clave && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.clave}</p>}

            {formData.clave && (
              <div className="mt-2 animate-fade-in">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map((level) => (
                    <div key={level} className={`h-1 flex-1 rounded transition-all duration-500 ${level <= passwordStrength.level ? `${passwordStrength.color} scale-y-150` : 'bg-gray-200'}`} style={{ transitionDelay: `${level * 50}ms` }} />
                  ))}
                </div>
                <p className="text-xs text-gray-600 transition-all duration-300">Fortaleza: <span className="font-medium">{passwordStrength.text}</span></p>
              </div>
            )}
          </div>

          <div className="animate-slide-up animation-delay-600">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.confirmPassword}
                placeholder= "Confirmar Contraseña"
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-slide-up animation-delay-800">
            {loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Creando cuenta...</span> : 'Crear Cuenta'}
          </button>
        </form>

        <div className="relative my-6 animate-slide-up animation-delay-900">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">O regístrate con</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 animate-slide-up animation-delay-1000">
          <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95">
            {/* Google SVG */}
            Google
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-6 animate-slide-up animation-delay-1100">
          ¿Ya tienes cuenta? <Link href="/auth/login" className="text-purple-600 font-semibold hover:underline transition-all">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};