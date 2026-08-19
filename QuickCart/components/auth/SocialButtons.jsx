'use client'
import React from 'react';
export default function SocialButtons({
  onGoogle = () => {},
  className = '',
  animationDelay = '',
}) {
  return (
    <div className={`mt-6 space-y-3 ${animationDelay} ${className}`}>
      <button
        type="button"
        onClick={onGoogle}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:shadow-sm transition"
        aria-label="Iniciar sesión con Google"
      >
        {/* Simple Google mark */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M21.805 10.023h-9.78v3.954h5.604c-.24 1.536-1.464 3.55-4.238 3.55-2.55 0-4.628-2.102-4.628-4.695s2.078-4.695 4.628-4.695c1.45 0 2.422.616 2.98 1.145l3.212-3.093C17.83 4.06 15.633 3 12 3 6.478 3 2 7.477 2 13s4.478 10 10 10c5.75 0 9.84-4.03 9.84-9.69 0-.65-.055-1.11-.035-1.287z" fill="#EA4335"/>
        </svg>
        <span className="text-sm font-medium text-gray-700">Continuar con Google</span>
      </button>
    </div>
  );
}