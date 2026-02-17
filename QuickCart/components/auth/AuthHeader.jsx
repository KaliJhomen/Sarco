'use client'
import React from 'react';
import Image from 'next/image';

export default function AuthHeader({ title, subtitle, logoColor = 'bg-blue-600', logoText = 'QC', logoSrc = null }) {
  return (
    <div className="mb-6 text-center">
      {logoSrc ? (
        <div className="mb-3">
          <Image src={logoSrc} alt={logoText} width={300} height={300} className="mx-auto" />
        </div>
      ) : (
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${logoColor} text-white font-bold mb-3`}>
          {logoText}
        </div>
      )}
      <h2 className="text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}