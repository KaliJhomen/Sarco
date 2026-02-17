'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  useCart,
  useRemoveFromCart,
  useClearCart,
} from '@/hooks/server/useCart';

export default function CartPage() {
  const userId = 1; // Reemplaza con el ID del usuario autenticado
  const { data: cartData, isLoading, error } = useCart(userId);
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const handleRemoveFromCart = (productId) => {
    removeFromCartMutation.mutate({ userId, productId });
  };

  const handleClearCart = () => {
    clearCartMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Cargando tu carrito...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error al cargar el carrito</h1>
          <p className="text-gray-600">{error.message}</p>
          <Link href="/shop" className="px-4 py-2 bg-blue-600 text-white rounded">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const cartItems = cartData || [];
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.producto.precioVenta * item.cantidad,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <Link href="/shop" className="px-4 py-2 bg-blue-600 text-white rounded">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi Carrito</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-gray-200 py-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20">
                <Image
                  src={item.producto.imagen || '/productos/placeholder.svg'}
                  alt={item.producto.nombre}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full rounded"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{item.producto.nombre}</h2>
                <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                <p className="text-sm text-gray-600">Precio: ${item.producto.precioVenta.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveFromCart(item.producto.idProducto)}
              className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-all"
            >
              Eliminar
            </button>
          </div>
        ))}

        <div className="mt-6 text-right">
          <h3 className="text-xl font-bold text-gray-800">
            Total: ${totalPrice.toFixed(2)}
          </h3>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleClearCart}
            className="px-6 py-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700 transition-all"
          >
            Vaciar carrito
          </button>
          <Link
            href="/checkout"
            className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-all"
          >
            Proceder al pago
          </Link>
        </div>
      </div>
    </div>
  );
}