"use client";

import { use } from "react";
import Image from "next/image";
import { useSharedCart } from "@/hooks/server/useCart";

export default function SharedCartPage({ params }) {

  const { token } = use(params);
  const { data, isLoading } = useSharedCart(token);

  if (isLoading) {
    return <p className="p-10 text-center">Cargando carrito...</p>;
  }

  const items = Array.isArray(data?.items) ? data.items : [];

  const totalPrice = items.reduce((total, item) => {
    const precio = Number(item.producto?.precioVenta) || 0;
    const cantidad = Number(item.cantidad) || 0;
    return total + precio * cantidad;
  }, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Este Carrito Ha Sido Compartido Contigo
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">

        {items.map((item) => {

          const precio = Number(item.producto?.precioVenta) || 0;
          const cantidad = Number(item.cantidad) || 0;

          const imagenSrc = item.producto?.imagen
            ? item.producto.imagen.startsWith('http') || item.producto.imagen.startsWith('/')
              ? item.producto.imagen
              : `/productos/${item.producto.imagen}`
            : '/productos/placeholder.svg';

          return (
            <div
              key={item.producto.idProducto}
              className="flex items-center justify-between border-b py-4"
            >

              <div className="flex items-center gap-4 flex-1">

                <Image
                  src={imagenSrc}
                  alt={item.producto.nombre}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />

                <div>
                  <h2 className="text-lg font-semibold">
                    {item.producto.nombre}
                  </h2>

                  <p className="text-sm text-gray-600">
                    Precio: ${precio.toFixed(2)}
                  </p>

                  <p className="text-sm text-gray-600">
                    Cantidad: {cantidad}
                  </p>

                  <p className="font-semibold">
                    Subtotal: ${(precio * cantidad).toFixed(2)}
                  </p>
                </div>

              </div>

            </div>
          );
        })}

        <div className="mt-6 text-right">
          <h3 className="text-2xl font-bold">
            Total: ${totalPrice.toFixed(2)}
          </h3>
        </div>

      </div>
    </div>
  );
}