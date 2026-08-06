'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import {
  useCart,
  useAddToCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useClearCart,
  useGenerateShareCart
} from '@/hooks/server/useCart';

import { useAuth } from '@/context/AuthContext';
import { getOrCreateSessionToken } from '@/utils/constants/session';

export default function CartPage() {
  const { user } = useAuth();
  const sessionToken = getOrCreateSessionToken();

  const { data: cartData } = useCart({
    sessionToken: user ? undefined : sessionToken
  });
  const items = Array.isArray(cartData?.items) ? cartData.items : [];
  const addToCartMutation = useAddToCart();
  const updateCartQuantityMutation = useUpdateCartQuantity();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  

  const handleAddToCart = (idProducto) => {
    addToCartMutation.mutate({ 
      sessionToken: user ? undefined : sessionToken,
      idProducto,
      quantity: 1
    });
  }

  const handleUpdateCartQuantity = (idProducto, quantity) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate({ idUser: user?.id, sessionToken, idProducto });
    } else {
      updateCartQuantityMutation.mutate({ idUser: user?.id, sessionToken, idProducto, quantity });
    }
  };

  const handleRemoveFromCart = (idProducto) => {
    removeFromCartMutation.mutate({ idUser: user?.id, sessionToken, idProducto });
  };


  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  const payload = cartData?.data ?? cartData;
  const cartItems = Array.isArray(cartData?.items)
    ? cartData.items
    : Array.isArray(cartData?.data?.items)
    ? cartData.data.items
    : [];
  console.log("user:", user);
  console.log("sessionToken:", sessionToken);
  console.log( "CartData", cartData)  

  const totalPrice = cartItems.reduce((total, item) => {
    const precio = Number(item.producto?.precioVenta) || 0;
    const cantidad = Number(item.cantidad) || 0;
    return total + precio * cantidad;
  }, 0);

  const { mutateAsync: generateShare } = useGenerateShareCart();

const handleContactSeller = async () => {

  const res = await generateShare({
    idUser: user?.id,
    sessionToken: user ? undefined : sessionToken
  });
console.log("RESPUESTA SHARE:", res);
  const shareUrl = `${window.location.origin}/cart/share/${res.url}`;

  const message = `Hola, quiero consultar por este carrito:\n${shareUrl}`;

  window.open(
    `https://wa.me/51917819784?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};
  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center animate-fade-in">
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi Carrito</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {cartItems.map((item, index) => {
          const precio = Number(item.producto?.precioVenta) || 0;
          const cantidad = Number(item.cantidad) || 0;
          const stock = Number(item.producto?.stock) || 0;
          const imagenSrc = item.producto?.imagen
            ? item.producto.imagen.startsWith('http') || item.producto.imagen.startsWith('/')
              ? item.producto.imagen
              : `/productos/${item.producto.imagen}`
            : '/productos/placeholder.svg';

          const isUpdating = updatingItem === item.producto.idProducto;
          const isRemoving = removingItem === item.producto.idProducto;

          return (
            <div
              key={item.idCarritoItem ?? item.idCarrito ?? `${item.producto?.idProducto}-${index}`}
              className={`flex items-center justify-between border-b border-gray-200 py-4 gap-4 transition-all duration-500 ${
                isRemoving ? 'opacity-0 scale-95 -translate-x-full' : 'opacity-100 scale-100 translate-x-0'
              }`}
              style={{
                animationName: 'slide-in-right',
                animationDuration: '0.5s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Imagen y detalles */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={imagenSrc}
                    alt={item.producto.nombre}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{item.producto.nombre}</h2>
                  <p className="text-sm text-gray-600">Precio unitario: ${precio.toFixed(2)}</p>
                  <p className={`text-sm font-semibold text-gray-800 transition-all duration-300 ${
                    isUpdating ? 'scale-110 text-blue-600' : ''
                  }`}>
                    Subtotal: ${(precio * cantidad).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Controles de cantidad */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpdateCartQuantity(item.producto.idProducto, cantidad - 1)}
                  disabled={cantidad <= 1 || isUpdating}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Minus size={16} />
                </button>
                <span className={`text-lg font-semibold text-gray-800 min-w-[2rem] text-center transition-all duration-300 ${
                  isUpdating ? 'scale-125 text-blue-600' : ''
                }`}>
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin inline" /> : cantidad}
                </span>
                <button
                  onClick={() => handleUpdateCartQuantity(item.producto.idProducto, cantidad + 1)}
                  disabled={cantidad >= stock || isUpdating}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => handleRemoveFromCart(item.producto.idProducto)}
                disabled={isRemoving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {isRemoving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                Eliminar
              </button>
            </div>
          );
        })}

        <div className="mt-6 text-right animate-slide-up">
          <h3 className="text-2xl font-bold text-gray-800 transition-all duration-300">
            Total: ${totalPrice.toFixed(2)}
          </h3>
        </div>
        <div className="mt-6 flex justify-end gap-4 animate-slide-up"
          style={{
            animationName: 'slide-up',
            animationDuration: '0.5s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
            animationDelay: '0.2s',
          }}
        >
          <button
            onClick={handleContactSeller}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Contactar por WhatsApp
          </button>
          <button
            onClick={handleClearCart}
            disabled={clearCartMutation.isLoading}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {clearCartMutation.isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Vaciando...
              </span>
            ) : (
              'Vaciar carrito'
            )}
          </button>

          <Link
            href="/checkout"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Proceder al pago
          </Link>
        </div>
      </div>
    </div>
  );
}