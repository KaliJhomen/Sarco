'use client'
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

const Breadcrumbs = ({ className = '' }) => {
  const { categoriesMenu } = useAppContext();
  const searchParams = useSearchParams();
  
  const c = (searchParams.get('c') || '').toLowerCase();
  const s = (searchParams.get('s') || '').toLowerCase();
  const t = (searchParams.get('t') || '').toLowerCase();
  const q = searchParams.get('q') || '';

  const normalize = (s) => (s || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const buildBreadcrumbs = () => {
    const items = [
      {
        label: 'Inicio',
        href: '/',
        isActive: false
      }
    ];

    if (!categoriesMenu || categoriesMenu.length === 0) {
      if (q) {
        items.push({
          label: 'Búsqueda',
          href: null,
          isActive: true
        });
      }
      return items;
    }

    let categoria = null;
    let subcategoria = null;
    let tipoProducto = null;

    for (const group of categoriesMenu) {
      const cNorm = normalize(group.title);
      if (c && cNorm === normalize(c)) {
        categoria = group;
        
        for (const col of group.columns || []) {
          const sNorm = normalize(col.title);
          if (s && sNorm === normalize(s)) {
            subcategoria = col;
            
            if (t && col.types) {
              const tipo = col.types.find((tp) => normalize(tp.name) === normalize(t));
              if (tipo) tipoProducto = tipo;
            }
            break;
          }
        }
        break;
      }
    }

    if (categoria) {
      items.push({
        label: categoria.title,
        href: `/shop/products?c=${encodeURIComponent(categoria.title)}`,
        isActive: !subcategoria && !tipoProducto
      });
    }

    if (subcategoria) {
      items.push({
        label: subcategoria.title,
        href: `/shop/products?c=${encodeURIComponent(categoria.title)}&s=${encodeURIComponent(subcategoria.title)}`,
        isActive: !tipoProducto
      });
    }

    if (tipoProducto) {
      items.push({
        label: tipoProducto.name,
        href: null,
        isActive: true
      });
    }

    if (q && !categoria) {
      items.push({
        label: `Búsqueda: ${q}`,
        href: null,
        isActive: true
      });
    }

    return items;
  };

  const breadcrumbs = buildBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; 
  }

  return (
    <div className={`breadcrumbs ${className}`}>
      <ul className="items flex flex-wrap items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <li
            key={index}
            className={`item ${item.isActive ? 'active' : ''} flex items-center gap-2`}
          >
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-orange-600 transition-colors"
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <strong className="text-gray-900 font-medium">{item.label}</strong>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="text-gray-400" aria-hidden="true">
                &gt;
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;

