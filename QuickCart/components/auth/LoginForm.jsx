'use client';
import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import AuthHeader from './AuthHeader';
import { useLoginForm } from '@/hooks/local/useLoginForm';
import PasswordInput from './PasswordInput';
import SocialButtons from './SocialButtons';
import { useRouter } from 'next/navigation';
import { assets } from '@/assets/assets';

export const LoginForm = () => {
  const {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit
  } = useLoginForm();
  const router = useRouter();

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
        <AuthHeader
          title="Bienvenido a SARCO'S"
          logoSrc={assets.logo}
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-up animation-delay-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" size={20} />
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Correo"
              />
            </div>
          </div>

          <PasswordInput
            label="Contraseña"
            value={formData.clave}
            onChange={(e) => handleChange('clave', e.target.value)}
            animationDelay="animation-delay-300"
          />

          <div className="flex items-center justify-between animate-slide-up animation-delay-400">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 transition-all"
                checked={formData.rememberMe}
                onChange={(e) => handleChange('rememberMe', e.target.checked)}
                placeholder='Contraseña'
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                Recordarme
              </span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:underline transition-all"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>

        <SocialButtons animationDelay="animation-delay-600" />

        <div className="mt-4 animate-slide-up animation-delay-650">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Continuar como invitado
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6 animate-slide-up animation-delay-700">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline transition-all">
            Regístrate aquí
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-gray-500 mt-6 animate-slide-up animation-delay-800">
        Al continuar, aceptas nuestros{' '}
        <Link href="/terms" className="underline hover:text-gray-700 transition-colors">
          Términos de Servicio
        </Link>
        {' '}y{' '}
        <Link href="/privacy" className="underline hover:text-gray-700 transition-colors">
          Política de Privacidad
        </Link>
      </p>
    </div>
  );
};