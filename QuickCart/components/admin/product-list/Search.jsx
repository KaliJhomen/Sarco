import React, { useState } from "react";
import Search from "@/components/admin/product-list/Search";
// ...otros imports...

const ProductListPage = () => {
  // ...estado y lógica previa...
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra productos según el término de búsqueda
  const filteredProducts = allProducts.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.nombre?.toLowerCase().includes(term) ||
      product.modelo?.toLowerCase().includes(term) ||
      product.marca?.nombre?.toLowerCase().includes(term) ||
      product.categoria?.nombre?.toLowerCase().includes(term)
    );
  });

  const products = filteredProducts.slice(0, displayedCount);

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Todos los Productos ({filteredProducts.length})
          </h1>
          <button
            onClick={() => router.push("/admin/add/product")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Agregar Producto
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <Search value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* ...resto del renderizado de la tabla... */}
      </div>
    </div>
  );
};

export default ProductListPage;