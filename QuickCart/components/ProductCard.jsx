"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Package, CheckCircle } from "lucide-react";
import { formatPrice } from "@/utils/helpers/formatters";
import { useAddToCart } from "@/hooks/server/useCart";
import { useNotification } from "@/context/NotificationContext";
import { useAddToFavorites, useRemoveFromFavorites, useFavorites } from "@/hooks/server/useFavorites";
import { getOrCreateSessionToken } from "@/utils/constants/session";
import { useAuth} from '@/context/AuthContext'


const ProductCard = ({ product }) => {
  
const { addNotification } = useNotification();
const { cliente } = useAuth();

const [isAdding, setIsAdding] = useState(false);
const addToCartMutation = useAddToCart();

// Hooks de favoritos
const favoritesPayload = { sessionToken: getOrCreateSessionToken() };
const { data: favoritesData } = useFavorites(favoritesPayload);
const addToFavoritesMutation = useAddToFavorites();
const removeFromFavoritesMutation = useRemoveFromFavorites();
const [isProcessingFavorite, setIsProcessingFavorite] = useState(false);

const {
  idProducto,
  nombre,
  modelo,
  descripcion,
  precioVenta,
  precioTope,
  descuento,
  stock,
  imagen,
} = product;

if (!product) {
  return null;
}

  // Determinar si el producto está en favoritos
  const items = favoritesData?.items ?? favoritesData?.data?.items ?? [];
  const isFavorite = Array.isArray(items) && items.some((fav) => Number(fav.idProducto ?? fav.producto?.idProducto) === Number(idProducto));

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessingFavorite) return;
    setIsProcessingFavorite(true);
    const sessionToken= getOrCreateSessionToken();
    const payload = { idProducto: Number(product.idProducto) };
    if (!cliente) {
      payload.sessionToken = sessionToken;
    }
    try {
      if (isFavorite) {
        await removeFromFavoritesMutation.mutateAsync(payload);
        addNotification("Eliminado de favoritos", "success");
      } else {
        await addToFavoritesMutation.mutateAsync(payload);
        addNotification("Agregado a favoritos", "success");
      }
    } catch (err) {
      addNotification("Error al actualizar favoritos", "error");
    } finally {
      setIsProcessingFavorite(false);
    }
  };

///

  const productId = idProducto;
  const productName = nombre || "Producto sin nombre";
  const productModel = modelo || "";
  const productDescription = descripcion || "";
  const productPrice = Number(precioVenta) || 0;
  const productDiscount = Number(descuento) || 0;
  const productStock = Number(stock) || 0;
  const brandName = product.marca || "";

  const hasDiscount = productDiscount > 0;
  const finalPrice = hasDiscount
    ? productPrice * (1 - productDiscount / 100)
    : productPrice;

  const isOutOfStock = productStock === 0;
  const isLowStock = productStock > 0 && productStock <= 5;

  const getImageUrl = (imageName) => {
    if (!imageName) {
      return "/productos/placeholder.svg"; //Imagen por defecto
    }

    // Si ya es una URL completa, retornarla
    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }

    // Si ya tiene /productos/, retornarla directamente
    if (imageName.startsWith("/productos/")) {
      return imageName;
    }

    // Limpiar barra inicial si existe
    const cleanImageName = imageName.startsWith("/") ? imageName.slice(1) : imageName;

    return `/productos/${cleanImageName}`;
  };

  const imageUrl = getImageUrl(imagen);
  const [src, setSrc] = useState(imageUrl);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || isAdding) return;

    setIsAdding(true);

    try {
      // Si el usuario está autenticado, solo envía idProducto y quantity
      // Si es guest, agrega sessionToken
      const payload = {
        idProducto: Number(idProducto),
        quantity: 1,
      };

      if (!cliente) {
        payload.sessionToken = getOrCreateSessionToken();
      }

      await addToCartMutation.mutateAsync(payload);

      addNotification(`✓ ${productName} agregado al carrito`, 'success');

      setTimeout(() => {
        setIsAdding(false);
      }, 1000);

    } catch (error) {
      addNotification("Error al agregar al carrito", 'error');
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/product/${productId}`}>
      <div className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col relative">
        
        {/* Imagen del producto */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <Image
            src={src}
            alt={productName}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              setSrc("/productos/placeholder.svg");
            }}
            priority={false}
          />

          {/* Badge de descuento */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
              -{productDiscount}%
            </div>
          )}

          {/* Botón de favoritos */}
          <button
            onClick={handleFavorite}
            disabled={isProcessingFavorite}
            className={`absolute top-2 left-2 p-2 rounded-full transition-all duration-200 z-10 shadow-md ${
              isFavorite
                ? 'bg-red-500 text-white scale-100'
                : 'bg-white/90 text-gray-600 hover:bg-red-50 scale-0 group-hover:scale-100'
            }`}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Badge de stock bajo */}
          {isLowStock && (
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
              ¡Quedan {productStock}!
            </div>
          )}

          {/* Overlay de agotado */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
              <div className="text-center">
                <Package className="mx-auto mb-2 text-white" size={32} />
                <span className="text-white font-bold text-lg">Agotado</span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido del producto */}
        <div className="p-4 flex-1 flex flex-col">
          
          {/* Marca */}
          {brandName && (
            <span className="text-xs text-orange-600 uppercase tracking-wide font-semibold mb-1">
              {brandName}
            </span>
          )}

          {/* Nombre del producto */}
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors mb-1 min-h-[2.5rem]">
            {productName}
          </h3>

          {/* Modelo */}
          {productModel && (
            <p className="text-xs text-gray-500 mb-2">
              Modelos: {productModel}
            </p>
          )}

          {/* Descripción */}
          {productDescription && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-1">
              {productDescription}
            </p>
          )}

          {/* Sección de precio y acciones */}
          <div className="mt-auto space-y-3">
            
            {/* Precio */}
            <div className="flex items-baseline gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-bold text-orange-600">
                    {formatPrice(finalPrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(productPrice)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-800">
                  {formatPrice(productPrice)}
                </span>
              )}
            </div>

            {/* Mensaje de financiamiento */}
            {finalPrice > 200 && !isOutOfStock && (
              <p className="text-xs text-green-600 font-medium">
                Hasta 12x {formatPrice(finalPrice / 12)} sin interés
              </p>
            )}

            {/* Stock disponible */}
            {!isOutOfStock && productStock > 0 && (
              <p className="text-xs text-gray-500">
                Stock: {productStock} unidad{productStock !== 1 ? 'es' : ''}
              </p>
            )}

            {/* Botón agregar al carrito */}
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isOutOfStock || isAdding
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-md hover:shadow-lg'
              }`}
            >
              <ShoppingCart size={18} />
              {isAdding ? 'Agregando...' : isOutOfStock ? 'Agotado' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;