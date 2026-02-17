"use client";
import React, { useState, useMemo, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCategories } from "@/hooks/server/useCategories";
import { useSubCategories } from "@/hooks/server/useSubCategories";
import { useBrands } from "@/hooks/server/useBrands";
import { useFilteredProducts } from "@/hooks/server/useProducts";
import { ChevronUp, ChevronDown } from "lucide-react";
import { normalize } from "./filters.utils";

const FiltersSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Hooks para obtener datos
  const { data: categories = [] } = useCategories();
  const { data: subCategories = [] } = useSubCategories();
  const { data: brands = [] } = useBrands();

  // Obtener filtros actuales desde URL
  const currentCategories = searchParams.getAll("c[]");
  const currentSubcategories = searchParams.getAll("s[]");
  const priceMin = Number(searchParams.get("price_min") || "") || undefined;
  const priceMax = Number(searchParams.get("price_max") || "") || undefined;
  const currentBrandIds = searchParams.getAll("marca_id[]").map(id => Number(id));

  // Hook para productos filtrados - se actualiza cuando cambian los parámetros de URL
  const { data: filteredProducts = [] } = useFilteredProducts({
    c: currentCategories.length > 0 ? currentCategories : undefined,
    s: currentSubcategories.length > 0 ? currentSubcategories : undefined,
    marca_id: currentBrandIds.length > 0 ? currentBrandIds : undefined,
    price_min: priceMin,
    price_max: priceMax,
  });

  // Estados de secciones colapsables
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    subcategories: true,
    brands: true,
    price: true,
  });

  // Estados locales
  const [localPriceMin, setLocalPriceMin] = useState(priceMin || "");
  const [localPriceMax, setLocalPriceMax] = useState(priceMax || "");

  // Toggle sección
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calcular rango de precios desde los productos filtrados
  const priceRange = useMemo(() => {
    if (!filteredProducts.length) return { min: 0, max: 10000 };
    const prices = filteredProducts.map(p => p.precioVenta || 0).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 10000 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [filteredProducts ]);

  // Actualizar URL sin recargar toda la página
  const updateURL = (params) => {
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Toggle categoría (múltiple selección)
  const toggleCategory = (categoryName) => {
    const params = new URLSearchParams(searchParams.toString());
    const normalized = normalize(categoryName);
    const current = params.getAll("c[]").map(c => normalize(c));
    
    params.delete("c[]");
    
    if (current.includes(normalized)) {
      // Deseleccionar
      current.filter(c => c !== normalized).forEach(c => {
        // Buscar el nombre original en categories
        const originalName = categories.find(cat => normalize(cat.nombre) === c)?.nombre || c;
        params.append("c[]", originalName);
      });
    } else {
      // Seleccionar
      [...current, normalized].forEach(c => {
        const originalName = categories.find(cat => normalize(cat.nombre) === c)?.nombre || c;
        params.append("c[]", originalName);
      });
    }

    // Si no quedan categorías, limpiar subcategorías
    if (!params.has("c[]")) {
      params.delete("s[]");
    } else {
      // Filtrar subcategorías válidas
      const selectedCategoryIds = categories
        .filter(cat => params.getAll("c[]").map(c => normalize(c)).includes(normalize(cat.nombre)))
        .map(cat => cat.idCategoria);
      
      const validSubcategories = subCategories
        .filter(sc => selectedCategoryIds.includes(sc.idCategoria))
        .map(sc => normalize(sc.nombre));
      
      const currentSubs = params.getAll("s[]").map(s => normalize(s));
      params.delete("s[]");
      
      currentSubs
        .filter(sub => validSubcategories.includes(sub))
        .forEach(sub => {
          const originalName = subCategories.find(sc => normalize(sc.nombre) === sub)?.nombre || sub;
          params.append("s[]", originalName);
        });
    }

    updateURL(params);
  };

  // Toggle subcategoría (múltiple selección)
  const toggleSubcategory = (subcategoryName) => {
    const params = new URLSearchParams(searchParams.toString());
    const normalized = normalize(subcategoryName);
    const current = params.getAll("s[]").map(s => normalize(s));
    
    params.delete("s[]");
    
    if (current.includes(normalized)) {
      current.filter(s => s !== normalized).forEach(s => {
        const originalName = subCategories.find(sc => normalize(sc.nombre) === s)?.nombre || s;
        params.append("s[]", originalName);
      });
    } else {
      [...current, normalized].forEach(s => {
        const originalName = subCategories.find(sc => normalize(sc.nombre) === s)?.nombre || s;
        params.append("s[]", originalName);
      });
    }

    updateURL(params);
  };

  // Limpiar filtro de categorías
  const clearCategoryFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("c[]");
    params.delete("s[]");
    updateURL(params);
  };

  // Limpiar filtro de subcategorías
  const clearSubcategoryFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("s[]");
    updateURL(params);
  };

  // Limpiar filtro de marcas
  const clearBrandsFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("marca_id[]");
    updateURL(params);
  };

  // Limpiar filtro de precio
  const clearPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("price_min");
    params.delete("price_max");
    setLocalPriceMin("");
    setLocalPriceMax("");
    updateURL(params);
  };

  // Toggle marca
  const toggleBrand = (brandId) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("marca_id[]");
    
    params.delete("marca_id[]");
    
    if (current.includes(String(brandId))) {
      current.filter(id => id !== String(brandId)).forEach(id => {
        params.append("marca_id[]", id);
      });
    } else {
      [...current, String(brandId)].forEach(id => {
        params.append("marca_id[]", id);
      });
    }

    updateURL(params);
  };

  // Aplicar filtro de precio
  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (localPriceMin) {
      params.set("price_min", localPriceMin);
    } else {
      params.delete("price_min");
    }

    if (localPriceMax) {
      params.set("price_max", localPriceMax);
    } else {
      params.delete("price_max");
    }

    updateURL(params);
  };

  // Obtener subcategorías filtradas por categorías seleccionadas
  const filteredSubCategories = useMemo(() => {
    if (currentCategories.length === 0) return [];
    
    const selectedCategoryIds = categories
      .filter(c => currentCategories.map(cat => normalize(cat)).includes(normalize(c.nombre)))
      .map(c => c.idCategoria);
    
    if (selectedCategoryIds.length === 0) return [];
    
    return subCategories
      .filter(sc => selectedCategoryIds.includes(sc.idCategoria))
      .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
  }, [categories, subCategories, currentCategories]);

  // Componente de sección colapsable
  const CollapsibleSection = ({ title, section, onClear, showClear, children }) => (
    <div className="border-b border-gray-200">
      <div className="bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => toggleSection(section)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-sm uppercase text-gray-900">
            {title}
          </span>
          {expandedSections[section] ? (
            <ChevronUp size={18} className="text-gray-600" />
          ) : (
            <ChevronDown size={18} className="text-gray-600" />
          )}
        </button>
      </div>

      {expandedSections[section] && (
        <div className="p-4">
          {children}
          {showClear && (
            <button
              onClick={onClear}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium uppercase tracking-wide"
            >
              LIMPIAR FILTRO
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-h-[calc(100vh-180px)] flex flex-col">
      {isPending && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 animate-pulse z-10"></div>
      )}

      {/* Contenedor con scroll */}
      <div className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        {/* Categorías - Selección múltiple */}
        <CollapsibleSection
          title="Categorías"
          section="categories"
          onClear={clearCategoryFilter}
          showClear={currentCategories.length > 0}
        >
          <div className="space-y-2">
            {categories.map((cat) => {
              const isSelected = currentCategories.map(c => normalize(c)).includes(normalize(cat.nombre));
              return (
                <label
                  key={cat.idCategoria}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(cat.nombre)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={`text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {cat.nombre}
                  </span>
                </label>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Subcategorías - Solo mostrar si hay categorías seleccionadas */}
        {currentCategories.length > 0 && filteredSubCategories.length > 0 && (
          <CollapsibleSection
            title="Subcategorías"
            section="subcategories"
            onClear={clearSubcategoryFilter}
            showClear={currentSubcategories.length > 0}
          >
            <div className="space-y-2">
              {filteredSubCategories.map((subCat) => {
                const isSelected = currentSubcategories.map(s => normalize(s)).includes(normalize(subCat.nombre));
                return (
                  <label
                    key={subCat.idSubCategoria}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSubcategory(subCat.nombre)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {subCat.nombre}
                    </span>
                  </label>
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* Marcas */}
        <CollapsibleSection
          title="Marcas"
          section="brands"
          onClear={clearBrandsFilter}
          showClear={currentBrandIds.length > 0}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {brands.map((brand) => {
              const isSelected = currentBrandIds.includes(brand.idMarca);
              return (
                <label
                  key={brand.idMarca}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleBrand(brand.idMarca)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={`text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {brand.nombre}
                  </span>
                </label>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Precio */}
        <CollapsibleSection
          title="Rango de Precio"
          section="price"
          onClear={clearPriceFilter}
          showClear={!!(priceMin || priceMax)}
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="block text-xs text-gray-600 uppercase">Mínimo</label>
              <input
                type="number"
                placeholder={`S/ ${priceRange.min}`}
                value={localPriceMin}
                onChange={(e) => setLocalPriceMin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                min={priceRange.min}
                max={priceRange.max}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-gray-600 uppercase">Máximo</label>
              <input
                type="number"
                placeholder={`S/ ${priceRange.max}`}
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                min={priceRange.min}
                max={priceRange.max}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={applyPriceFilter}
              className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default FiltersSidebar;

