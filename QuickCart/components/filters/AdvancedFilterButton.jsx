"use client";
import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { normalize as fnNormalize } from "@/components/filters/filters.utils";
const AdvancedFilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    categorias: [],
    marcas: [],
    tiendas: [],
    precioMin: "",
    precioMax: "",
  });

  const [searchCategory, setSearchCategory] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const { brands, stores, categoriesMenu } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Categorías reales desde el backend
  const categorias = useMemo(() => {
    const list = Array.isArray(categoriesMenu) ? categoriesMenu : [];
    return list
      .map((cat) => ({ id: cat?.id ?? cat?.value ?? cat?._id, nombre: cat?.title ?? cat?.nombre }))
      .filter((c) => c.id && c.nombre);
  }, [categoriesMenu]);

  // Lista de marcas reales provista por el contexto
  const tiendas = useMemo(() => {
    return (stores || []).map((t) => ({ id: t?.idTienda, nombre: t?.nombre })).filter((t) => t.id && t.nombre);
  }, [stores]);

  const toggleFilter = (type, id) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((item) => item !== id)
        : [...prev[type], id],
    }));
  };

  const handleApplyFilters = () => {
    const usp = new URLSearchParams(searchParams.toString());
    // Categoría: si hay seleccionadas, tomar la primera y aplicarla por nombre
    if (filters.categorias.length > 0) {
      const firstId = filters.categorias[0];
      const catObj = categorias.find((c) => String(c.id) === String(firstId));
      if (catObj?.nombre) {
        usp.set("c", String(catObj.nombre));
        // Limpiar subcategoría y tipo si aplicamos categoría principal
        usp.delete("s");
        usp.delete("t");
      }
    }
    // Marcas: limpiar y aplicar seleccionadas
    usp.delete("marca_id");
    usp.delete("marca_id[]");
    filters.marcas.forEach((id) => usp.append("marca_id[]", String(id)));
    // Tiendas: limpiar y aplicar seleccionadas
    usp.delete("tienda_id");
    usp.delete("tienda_id[]");
    filters.tiendas.forEach((id) => usp.append("tienda_id[]", String(id)));
    // Precio
    if (filters.precioMin) usp.set("price_min", String(filters.precioMin)); else usp.delete("price_min");
    if (filters.precioMax) usp.set("price_max", String(filters.precioMax)); else usp.delete("price_max");

    router.push(`${pathname}?${usp.toString()}`);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      categorias: [],
      marcas: [],
      tiendas: [],
      precioMin: "",
      precioMax: "",
    });
  };

  const filteredCategories = useMemo(() => {
    const q = fnNormalize(searchCategory || "");
    return categorias.filter((cat) => fnNormalize(cat.nombre || "").includes(q));
  }, [categorias, searchCategory]);

  const visibleCategories = useMemo(() => {
    if ((searchCategory || "").trim() !== "") return filteredCategories;
    return filteredCategories.slice(0, 4);
  }, [filteredCategories, searchCategory]);

  const filteredBrands = useMemo(() => {
    const list = Array.isArray(brands) ? brands : [];
    const q = fnNormalize(searchBrand || "");
    return list.filter((b) => fnNormalize(b?.nombre || b?.name || "").includes(q));
  }, [brands, searchBrand]);

  const visibleBrands = useMemo(() => {
    if ((searchBrand || "").trim() !== "") return filteredBrands;
    return filteredBrands.slice(0, 4);
  }, [filteredBrands, searchBrand]);

  const activeFiltersCount =
    filters.categorias.length +
    filters.marcas.length +
    filters.tiendas.length +
    (filters.precioMin ? 1 : 0) +
    (filters.precioMax ? 1 : 0);

  return (
    <div className="relative">
      {/* Botón principal con tooltip */}
      <div className="group relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brandRed-50 border-2 border-brandRed-300 rounded-lg text-brandRed-700 hover:border-brandRed-500 hover:bg-brandRed-100 transition-all duration-200 shadow-softRed hover:shadow-softRedMd"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium text-gray-700">Filtrar</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute left-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
            Filtrar por categoría, precio, tienda y marca
            <div className="absolute bottom-full left-6 border-4 border-transparent border-b-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Panel de filtros deslizante */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-red-500 to-red-600">
          <div>
            <h2 className="text-lg font-semibold text-white">Filtros Avanzados</h2>
            {activeFiltersCount > 0 && (
              <p className="text-xs text-red-100">
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? "s" : ""} activo{activeFiltersCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-red-600 rounded-full transition"
            aria-label="Cerrar filtros"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Categorías */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Categorías</label>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 6a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {visibleCategories.map((cat) => (
                <li key={cat.id}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.categorias.includes(cat.id)}
                      onChange={() => toggleFilter("categorias", cat.id)}
                    />
                    <span>{cat.nombre}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Marcas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Marcass</label>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Buscar marca..."
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 6a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {visibleBrands.map((brand, idx) => {
                const id = brand?.idMarca ?? brand?.id ?? brand?._id ?? idx;
                const name = brand?.nombre ?? brand?.name ?? String(id);
                const checked = filters.marcas.includes(id);
                return (
                  <li key={String(id)}>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilter("marcas", id)}
                      />
                      <span>{name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tiendas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Tiendas</label>
            <ul className="space-y-2">
              {tiendas.map((tienda) => (
                <li key={tienda.id}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.tiendas.includes(tienda.id)}
                      onChange={() => toggleFilter("tiendas", tienda.id)}
                    />
                    <span>{tienda.nombre}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Precio</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                className="w-28 px-2 py-1 border rounded text-sm"
                placeholder="S/ mín"
                value={filters.precioMin}
                onChange={(e) => setFilters((p) => ({ ...p, precioMin: e.target.value }))}
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                className="w-28 px-2 py-1 border rounded text-sm"
                placeholder="S/ máx"
                value={filters.precioMax}
                onChange={(e) => setFilters((p) => ({ ...p, precioMax: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Footer acciones */}
        <div className="px-6 py-3 border-t bg-white flex items-center justify-between mt-auto">
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm text-brandRed-700 bg-brandRed-50 border border-brandRed-300 rounded hover:bg-brandRed-100 hover:border-brandRed-500 shadow-softRed"
          >
            Limpiar
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 text-sm bg-brandRed-600 text-white rounded hover:bg-brandRed-500 shadow-softRed"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterButton;  