'use client'
import React from 'react';
import CategorySection from './CategorySection';
import { Percent, TrendingUp, Zap, Package, Star, Sparkles } from 'lucide-react';

const FILTERS = {
  // Productos con descuento
  withDiscount: (product) => {
    const descuento = product?.descuento || 0;
    return descuento > 0;
  },

  // Productos más vendidos (descuento >= 15% y stock >= 5)
  bestsellers: (product) => {
    const descuento = product?.descuento || 0;
    const stock = product?.stock_total || product?.stockTotal || 0;
    return descuento >= 15 && stock >= 5;
  },

  // Últimas unidades (stock bajo)
  lowStock: (product) => {
    const stock = product?.stock_total || product?.stockTotal || 0;
    return stock > 0 && stock < 10;
  },

  // Productos nuevos (últimos 30 días)
  newArrivals: (product) => {
    if (!product?.createdAt && !product?.fecha_ingreso && !product?.fecha) {
      return false;
    }
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);
    const fechaCreacion = new Date(product.createdAt || product.fecha_ingreso || product.fecha);
    return fechaCreacion >= fechaLimite;
  },

  // Productos premium (precio > 500 con descuento >= 10%)
  premium: (product) => {
    const precio = product?.precio_venta || product?.precioVenta || product?.precio || 0;
    const descuento = product?.descuento || 0;
    return precio > 500 && descuento >= 10;
  },
};

const SORTS = {
  // Mayor descuento primero
  byDiscountDesc: (a, b) => {
    const descuentoA = a?.descuento || 0;
    const descuentoB = b?.descuento || 0;
    return descuentoB - descuentoA;
  },

  // Menor stock primero (más urgente)
  byStockAsc: (a, b) => {
    const stockA = a?.stock_total || a?.stockTotal || 0;
    const stockB = b?.stock_total || b?.stockTotal || 0;
    return stockA - stockB;
  },

  // Más recientes primero
  byNewest: (a, b) => {
    const fechaA = new Date(a?.createdAt || a?.fecha_ingreso || a?.fecha || 0);
    const fechaB = new Date(b?.createdAt || b?.fecha_ingreso || b?.fecha || 0);
    return fechaB - fechaA;
  },

  // Mayor precio primero
  byPriceDesc: (a, b) => {
    const precioA = a?.precio_venta || a?.precioVenta || a?.precio || 0;
    const precioB = b?.precio_venta || b?.precioVenta || b?.precio || 0;
    return precioB - precioA;
  },
};

const FeaturedSection = () => {
  const sections = [
    {
      title: "Ofertas",
      icon: Percent, 
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      description: "No te pierdas estas promociones",
      filterFn: FILTERS.withDiscount,
      sortFn: SORTS.byDiscountDesc,
      limit: 12
    },
    {
      title: "Más Vendidos",
      icon: TrendingUp,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
      description: "Los favoritos de nuestros clientes",
      filterFn: FILTERS.bestsellers,
      sortFn: SORTS.byDiscountDesc,
      limit: 12
    },
    {
      title: "Últimas Unidades",
      icon: Zap, 
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      description: "¡Aprovecha antes de que se agoten!",
      filterFn: FILTERS.lowStock,
      sortFn: SORTS.byStockAsc,
      limit: 12
    },
    {
      title: "Recién Llegados",
      icon: Sparkles, 
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      description: "Nuevos Productos",
      filterFn: FILTERS.newArrivals,
      sortFn: SORTS.byNewest,
      limit: 12
    },
  ];

  return (
    <div className="space-y-16">
      {sections.map((section, index) => (
        <React.Fragment key={section.title}>
          {/* Sección de productos */}
          <div 
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Pasa filtros a CategorySection */}
            <CategorySection 
              filterFn={FILTERS.withDiscount}  // Función de filtrado
              sortFn={SORTS.byDiscountDesc}    // Función de ordenamiento
              {...section} 
            />
          </div>

          {/* Separador entre secciones */}
          {index < sections.length - 1 && (
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FeaturedSection;