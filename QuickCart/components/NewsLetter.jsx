'use client';

import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!email.trim()) {
      setError('Ingresa un correo electrónico.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Ingresa un correo válido.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || 'Error al suscribir');
      }

      setSuccess('¡Listo! Te llegaran las mejores ofertas.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Error en la suscripción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center space-y-4 pt-8 pb-14">
      <h2 className="md:text-4xl text-2xl font-semibold">
        ¡Suscríbete y recibe ofertas exclusivas!
      </h2>

      <form onSubmit={handleSubmit} className="flex items-center max-w-2xl w-full bg-white/60 backdrop-blur-sm rounded-lg shadow-sm p-1">
        <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo electrónico"
          className="flex-1 px-4 py-3 text-sm rounded-l-md outline-none border border-gray-200 focus:ring-2 focus:ring-orange-300"
          aria-invalid={!!error}
        />

        <button
          type="submit"
          disabled={loading}
          className="md:px-12 px-6 py-3 bg-orange-600 text-white rounded-r-md text-sm font-medium hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Enviando...' : 'Suscribirse'}
        </button>
      </form>

      <div aria-live="polite" className="min-h-[1.2rem]">
        {success && <p className="text-green-600 text-sm">{success}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      <p className="text-xs text-gray-500 max-w-xl">
        Al suscribirte aceptas recibir comunicaciones. Puedes darte de baja en cualquier momento.
      </p>
    </section>
  );
};

export default Newsletter;
