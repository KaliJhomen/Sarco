'use client'
import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { getAllCategories } from "@/components/filters/filters.utils";
import { ImageWithFallback } from "@/utils/imageResolver";

/**
 * Menú de categorías para filtrado de productos
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.horizontal - Layout horizontal (scroll) o grid
 * @param {string} props.chipWidth - Ancho de cada chip (clase Tailwind)
 */
const CategoryMenu = ({ 
  className = "", 
  horizontal = false, 
  chipWidth = "w-36",
  showSubcategories = false,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categoriesMenu, products, brands } = useAppContext();
  
  const activeCategory = (searchParams.get("c") || "").toLowerCase();
  const norm = (s) => String(s || '').toLowerCase().trim();
  const stripAccents = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const canonical = (s) => stripAccents(String(s || '')).toLowerCase().replace(/\s+/g, '').replace(/-/g, '').trim();


  const DISPLAY_OVERRIDES = {
    'tecnologia': 'Tecnología',
    'lineablanca': 'Línea Blanca',
    'linea blanca': 'Línea Blanca',
    'cuidadopersonal': 'Cuidado Personal',
    'cuidado personal': 'Cuidado Personal',
    'hogar': 'Hogar',
    'dormitorio': 'Dormitorio',
    'muebles': 'Muebles',
    'oficina': 'Oficina',
    'entretenimiento': 'Entretenimiento',
    'motos': 'Motos',
  };

  const formatLabel = (text) => {
    if (!text) return '';
    
    const smallWords = new Set([
      "de", "y", "del", "la", "las", "los", "el", "en", 
      "para", "por", "con", "o", "u", "a"
    ]);
    
    const txt = text.toLowerCase().trim();
    
    return txt.split(/\s+/).map((word, index) => {
      if (["usb", "hdmi", "ps", "pc", "tv", "led"].includes(word)) {
        return word.toUpperCase();
      }
      
      if (word === "wifi" || word === "wi-fi") return "Wi-Fi";
      
      if (smallWords.has(word) && index > 0) return word;
      
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  };


  const getDisplayName = (categoryName) => {
    const key = (categoryName || '').toLowerCase().trim();
    
    if (DISPLAY_OVERRIDES[key]) {
      return DISPLAY_OVERRIDES[key];
    }
    
    return formatLabel(categoryName);
  };

  
  const categories = useMemo(() => {
    const rawCategories = (categoriesMenu && categoriesMenu.length > 0)
      ? categoriesMenu.map((cat) => ({
          name: cat.title,
          value: cat.title,
          slug: cat.slug || cat.title.toLowerCase().replace(/\s+/g, '-'),
          id: cat.id
        }))
      : getAllCategories().map((cat) => ({
          name: cat.name,
          value: cat.name,
          slug: cat.slug,
          id: cat.id
        }));

    const categoriesMap = new Map();
    rawCategories.forEach((cat) => {
      const key = cat.value.toLowerCase().trim();
      if (!categoriesMap.has(key)) {
        categoriesMap.set(key, cat);
      }
    });

    return Array.from(categoriesMap.values());
  }, [categoriesMenu]);

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams(searchParams.toString());
    const isActive = activeCategory === category.value.toLowerCase();

    params.delete('s');
    params.delete('t');
    params.delete('brand');
    params.delete('marcas');

    if (isActive) {
      params.delete('c');
    } else {
      params.set('c', category.value);
    }

    params.delete('page');

    const queryString = params.toString();
    router.push(`/shop/products${queryString ? '?' + queryString : ''}`);
  };

  if (categories.length === 0) {
    return null;
  }

  const visibleBrands = useMemo(() => {
    try {
      const cat = norm(activeCategory);
      const counts = new Map();
      const labels = new Map();
      (products || [])
        .filter((p) => !cat || norm(p.category) === cat)
        .forEach((p) => {
          const lbl = (p.brand || '').trim();
          if (!lbl) return;
          const key = canonical(lbl);
          labels.set(key, lbl);
          counts.set(key, (counts.get(key) || 0) + 1);
        });
      const arr = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([key]) => ({ key, label: labels.get(key) || key }));
      return arr;
    } catch {
      return [];
    }
  }, [products, activeCategory]);

  const handleBrandClick = (brandLabel) => {
    const params = new URLSearchParams(searchParams.toString());
    const isActive = norm(params.get('brand')) === canonical(brandLabel);
    if (isActive) {
      params.delete('brand');
      params.delete('marcas');
    } else {
      params.set('brand', brandLabel);
      // Compatibilidad con backend: enviar también "marcas"
      params.set('marcas', brandLabel);
    }
    params.delete('page');
    router.push(`/shop/products?${params.toString()}`);
  };

  return (
    <div>
      <div 
        className={`
          ${horizontal 
            ? "flex flex-nowrap items-center gap-3 overflow-x-auto scrollbar-hide pb-2" 
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          } 
          ${className}
        `}
        role="navigation"
        aria-label="Filtro de categorías"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.value.toLowerCase();
          const displayName = getDisplayName(category.name);
          
          return (
            <button
              key={category.id || category.value}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`
                inline-flex items-center justify-center gap-2 cursor-pointer
                px-4 py-2 text-sm font-medium rounded-md border
                ${chipWidth} whitespace-nowrap
                transition-all duration-200 ease-in-out
                ${isActive 
                  ? "bg-orange-500 border-orange-500 text-white shadow-md" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm hover:shadow"
                }
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              `}
              title={displayName}
              aria-pressed={isActive}
              aria-label={`Filtrar por ${displayName}`}
            >                         
              <span className="truncate">
                {displayName}
              </span>
              
              {isActive && (
                <span className="ml-auto" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showSubcategories && activeCategory && Array.isArray(categoriesMenu) && categoriesMenu.length > 0 && (() => {
        try {
          const activeCatObj = (categoriesMenu || []).find((cat) => norm(cat.title) === norm(activeCategory));
          const subcats = (activeCatObj?.columns || []).map((col) => ({ id: col.id, nombre: col.title }));
          if (!subcats.length) return null;
          const BrandStrip = () => (
            visibleBrands && visibleBrands.length > 0 ? (
              <div className="mt-3 mb-2 flex items-center gap-3 overflow-x-auto scrollbar-hide" aria-label="Marcas destacadas">
                {visibleBrands.map(({ key, label }) => {
                  const logoBase = canonical(label);
                  const dbBrand = (brands || []).find((b) => {
                    const bn = canonical(b?.nombre || b?.name || '');
                    return bn && bn === logoBase;
                  });
                  const logoSrc = dbBrand?.logo || `/assets/logos/${logoBase}.svg`;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleBrandClick(label)}
                      className="flex items-center justify-center h-10 w-20 rounded-md border bg-white hover:bg-orange-50 hover:border-orange-300 transition"
                      title={label}
                      aria-label={`Filtrar por marca ${label}`}
                    >
                      <ImageWithFallback
                        src={logoSrc}
                        alt={label}
                        className="object-contain w-auto h-8"
                        width={80}
                        height={32}
                        unoptimized
                        strict={false}
                      />
                    </button>
                  );
                })}
              </div>
            ) : null
          );
          const handleSubClick = (sub) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('c', activeCatObj?.title || activeCategory);
            params.set('s', sub.nombre);
            params.delete('t');
            params.delete('page');
            const qs = params.toString();
            router.push(`/shop/products${qs ? '?' + qs : ''}`);
          };
          return (
            <div>
              <BrandStrip />
              <div className={`${horizontal ? 'mt-2 flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide' : 'mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'}`} aria-label="Filtro de subcategorías">
              {subcats.map((sc, idx) => (
                <button
                  key={`${String(activeCatObj?.id ?? 'cat')}-${String(sc.id ?? idx)}-${(sc.nombre || '').toLowerCase()}`}
                  type="button"
                  onClick={() => handleSubClick(sc)}
                  className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border ${horizontal ? 'whitespace-nowrap' : ''} bg-white border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition`}
                >
                  <span className="truncate">{formatLabel(sc.nombre)}</span>
                </button>
              ))}
              </div>
            </div>
          );
        } catch {
          return null;
        }
      })()}
    </div>
  );
};

export default CategoryMenu;