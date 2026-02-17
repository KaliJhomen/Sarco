import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { socialMedia, contactInfo } from "@/utils/constants/socialMedia";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 mt-20">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-gray-700">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Image 
              className="w-60 mb-4" 
              src={assets.logo} 
              alt="logo" 
            />
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Tu tienda de confianza para tecnología, hogar y movilidad. 
              Calidad garantizada y los mejores precios del mercado.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a 
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href={socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href={socialMedia.x}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition"
                aria-label="X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h2 className="font-semibold text-white mb-5 text-lg">Categorías</h2>
            <ul className="text-sm space-y-3">
              <li>
                <Link href="/shop/tecnologia" className="hover:text-red-500 transition flex items-center gap-2">
                  Tecnología
                </Link>
              </li>
              <li>
                <Link href="/shop/movilidad" className="hover:text-red-500 transition flex items-center gap-2">
                  Movilidad
                </Link>
              </li>
              <li>
                <Link href="/shop/hogar" className="hover:text-red-500 transition flex items-center gap-2">
                  Hogar
                </Link>
              </li>
              <li>
                <Link href="/shop/ofertas" className="hover:text-red-500 transition flex items-center gap-2">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h2 className="font-semibold text-white mb-5 text-lg">Ayuda</h2>
            <ul className="text-sm space-y-3">
              <li>
                <Link href="/faq" className="hover:text-red-500 transition flex items-center gap-2">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-red-500 transition flex items-center gap-2">
                  Métodos de Pago
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-red-500 transition flex items-center gap-2">
                  Envíos y Entregas
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-red-500 transition flex items-center gap-2">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="font-semibold text-white mb-5 text-lg">Contacto</h2>
            <ul className="text-sm space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {contactInfo.addresses.map((address, index) => (
                    <React.Fragment key={index}>
                      {address}
                      {index < contactInfo.addresses.length - 1 && <br/>}
                    </React.Fragment>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${socialMedia.phone.replace(/\s/g, '')}`} className="hover:text-red-500 transition">
                  {socialMedia.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${socialMedia.email}`} className="hover:text-red-500 transition">
                  {socialMedia.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>Copyright 2025 © <span className="text-white font-medium">Sarcos.com</span> - Todos los Derechos Reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-red-500 transition">Privacidad</Link>
            <Link href="/terms" className="hover:text-red-500 transition">Términos</Link>
            <Link href="/cookies" className="hover:text-red-500 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;