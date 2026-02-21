'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { 
  ShoppingCart, 
  Loader2, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Award,
  Package,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Tag
} from 'lucide-react';
import { useProduct } from "@/hooks/server/useProducts";
import { useAddToCart } from "@/hooks/server/useCart"; 
import { formatPrice } from '@/utils/helpers/formatters';

const Product = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useAppContext();

  // Obtener producto con todas sus relaciones
  const { data: productData, isLoading, error } = useProduct(id);

  const addToCartMutation = useAddToCart(); 

  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notification, setNotification] = useState("");
  const [imageError, setImageError] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Seleccionar primer color disponible
  useEffect(() => {
    if (productData?.productoColores?.length > 0) {
      const primerColorConStock = productData.productoColores.find(c => c.stock > 0);
      setColorSeleccionado(primerColorConStock || productData.productoColores[0]);
    }
  }, [productData]);

  // Reset imagen al cambiar color
  useEffect(() => {
    setImagenActiva(0);
    setImageError(false);
  }, [colorSeleccionado]);

  // Notificación temporal
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 text-orange-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Cargando producto...</p>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 mb-8">
            {error?.message || String(error) || 'El producto que buscas no está disponible o no existe.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Ir al inicio
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extraer TODOS los datos del producto
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
    estado,
    fechaIngreso,
    garantiaFabrica,
    idMarca2,
    productoColores = [],
    productoTipoProducto = [],
    productoTiendas = [],
  } = productData;

  // Calcular precios
  const precioOriginal = Number(precioVenta || 0);
  const precioTopeValue = Number(precioTope || 0);
  const descuentoValue = Number(descuento || 0);
  const precioFinal = descuentoValue > 0 
    ? precioOriginal * (1 - descuentoValue / 100) 
    : precioOriginal;

  // Calcular ahorro si hay precio tope
  const ahorro = precioTopeValue > precioOriginal ? precioTopeValue - precioOriginal : 0;

  // Obtener categoría, subcategoría y tipo de producto
  const tiposProducto = productoTipoProducto.map(ptp => ptp.idTipoProducto2).filter(Boolean);
  const allSubCategorias = tiposProducto.flatMap(tp => 
    (tp.tipoProductoSubCategoria || []).map(tpsc => tpsc.idSubCategoria2)
  ).filter(Boolean);
  const allCategorias = [...new Set(allSubCategorias.map(sc => sc.idCategoria2))].filter(Boolean);

  // Primera de cada una para mostrar
  const primerTipo = tiposProducto[0];
  const primeraSubCategoria = allSubCategorias[0];
  const primeraCategoria = allCategorias[0];

  // Obtener tiendas disponibles
  const tiendasDisponibles = productoTiendas.map(pt => pt.idTienda2).filter(Boolean);

  // Manejo de imágenes
  const getImageUrl = (imageName) => {
    if (!imageName) return '/productos/placeholder.svg';
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) return imageName;
    if (imageName.startsWith('/productos/')) return imageName;
    const cleanName = imageName.startsWith('/') ? imageName.slice(1) : imageName;
    return `/productos/${cleanName}`;
  };

  // Imágenes del color seleccionado o imagen principal
  const imagenesDelColor = colorSeleccionado?.imagen ? [colorSeleccionado.imagen] : [];
  const imagenPrincipal = imagenesDelColor[imagenActiva] || imagen;
  const imageUrl = !imageError ? getImageUrl(imagenPrincipal) : '/productos/placeholder.svg';

  // Stock disponible
  const stockDisponible = productoColores.length > 0 
    ? (colorSeleccionado?.stock ?? 0)
    : (stock ?? 0);
  const isOutOfStock = stockDisponible === 0;
  const isLowStock = stockDisponible > 0 && stockDisponible <= 5;

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getFriendlyCartError = (err) => {
    const status = err?.response?.status;
    const rawMessage =
      err?.response?.data?.message ||
      err?.message ||
      "";

    const text = Array.isArray(rawMessage) ? rawMessage.join(" ") : String(rawMessage);

    if (
      status === 401 ||
      status === 403 ||
      /unauthorized|token|jwt|no autenticado|forbidden|login/i.test(text)
    ) {
      return {
        message: "Para agregar productos al carrito, primero inicia sesión.",
        shouldRedirect: true,
      };
    }

    return {
      message: text || "No se pudo agregar al carrito. Inténtalo nuevamente.",
      shouldRedirect: false,
    };
  };

  // Handlers
  const handleAddToCart = async () => {
    if (isOutOfStock) {
      setNotification("Producto agotado");
      return;
    }

    if (productoColores.length > 0 && !colorSeleccionado) {
      setNotification("Por favor selecciona un color");
      return;
    }

    if (cantidad > stockDisponible) {
      setNotification(`Solo hay ${stockDisponible} unidades disponibles`);
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        idProducto: Number(idProducto),
        quantity: cantidad,
        precioUnitario: precioFinal, // ← Añade el precio unitario aquí
      });

      setNotification(`${cantidad}x ${nombre} agregado al carrito`);
    } catch (err) {
      const { message, shouldRedirect } = getFriendlyCartError(err);
      setNotification(message);

      if (shouldRedirect) {
        setShowLoginPrompt(true); 
      }
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setNotification(isFavorite ? "💔 Quitado de favoritos" : "❤️ Agregado a favoritos");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: nombre,
          text: descripcion || `Mira este producto: ${nombre}`,
          url: window.location.href
        });
        setNotification("Compartido exitosamente");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotification("Enlace copiado al portapapeles");
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const nextImage = () => {
    if (imagenesDelColor.length > 1) {
      setImagenActiva((prev) => 
        prev === imagenesDelColor.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (imagenesDelColor.length > 1) {
      setImagenActiva((prev) => 
        prev === 0 ? imagenesDelColor.length - 1 : prev - 1
      );
    }
  };

  const handleGoToLogin = () => {
    const redirect = encodeURIComponent(window.location.pathname);
    setShowLoginPrompt(false);
    router.push(`/auth/login?redirect=${redirect}`);
  };

  const handleStayHere = () => {
    setShowLoginPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificación Toast */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-fade-in-down max-w-md">
          <p className="text-center font-medium">{notification}</p>
        </div>
      )}

      {showLoginPrompt && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Deseas iniciar sesión?</h3>
            <p className="text-gray-600 mb-6">
              Para agregar productos al carrito necesitas iniciar sesión.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleStayHere}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Seguir navegando
              </button>
              <button
                onClick={handleGoToLogin}
                className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <button onClick={() => router.push('/')}
            className="hover:text-orange-600 transition-colors">
            Inicio
          </button>
          <span>/</span>
          {primeraCategoria && (
            <>
              <button 
                onClick={() => router.push(`/?c[]=${primeraCategoria.nombre}`)}
                className="hover:text-orange-600 transition-colors"
              >
                {primeraCategoria.nombre}
              </button>
              <span>/</span>
            </>
          )}
          {primeraSubCategoria && (
            <>
              <button 
                onClick={() => router.push(`/?s[]=${primeraSubCategoria.nombre}`)}
                className="hover:text-orange-600 transition-colors"
              >
                {primeraSubCategoria.nombre}
              </button>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium">{nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
              <Image
                src={imageUrl}
                alt={nombre}
                fill
                className="object-contain p-8"
                onError={() => setImageError(true)}
                priority
                unoptimized
              />

              {/* Badges sobre la imagen */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {descuentoValue > 0 && (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    -{Math.round(descuentoValue)}% OFF
                  </div>
                )}
                {estado === false && (
                  <div className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    No disponible
                  </div>
                )}
              </div>

              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center text-white">
                    <Package size={48} className="mx-auto mb-2" />
                    <p className="text-2xl font-bold">Agotado</p>
                  </div>
                </div>
              )}

              {isLowStock && !isOutOfStock && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                  ¡Solo quedan {stockDisponible}!
                </div>
              )}

              {/* Navegación de imágenes */}
              {imagenesDelColor.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {imagenesDelColor.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imagenesDelColor.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImagenActiva(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      imagenActiva === idx 
                        ? 'border-orange-500 scale-105' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt={`${nombre} - ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Header: Marca y acciones */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {idMarca2?.nombre && (
                  <p className="text-sm text-orange-600 font-bold uppercase tracking-wider mb-2">
                    {idMarca2.nombre}
                  </p>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                  {nombre}
                </h1>
                {modelo && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <Tag size={16} />
                    <span>Modelo: <span className="font-semibold">{modelo}</span></span>
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full transition-all ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                  title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all"
                  title="Compartir producto"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Sección de Precio */}
            <div className="border-t border-b border-gray-200 py-6 space-y-3">
              <div className="flex items-baseline gap-4 flex-wrap">
                {descuentoValue > 0 ? (
                  <>
                    <span className="text-4xl font-bold text-orange-600">
                      {formatPrice(precioFinal)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(precioOriginal)}
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      Ahorras {formatPrice(precioOriginal - precioFinal)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(precioOriginal)}
                  </span>
                )}
              </div>

              {/* Precio tope / Precio sugerido */}
              {precioTopeValue > precioOriginal && (
                <p className="text-sm text-gray-600">
                  Precio sugerido: <span className="line-through">{formatPrice(precioTopeValue)}</span>
                  {' '}(Ahorras {formatPrice(ahorro)})
                </p>
              )}

              {/* Financiamiento */}
              {precioFinal >= 200 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 font-semibold">
                    Hasta 12 cuotas sin interés de {formatPrice(precioFinal / 12)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    O 6 cuotas de {formatPrice(precioFinal / 6)}
                  </p>
                </div>
              )}
            </div>

            {/* Descripción */}
            {descripcion && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Info size={20} className="text-orange-600" />
                  Descripción
                </h3>
                <p className="text-gray-700 leading-relaxed">{descripcion}</p>
              </div>
            )}

            {/* Categorías y tipos */}
            {(allCategorias.length > 0 || tiposProducto.length > 0) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Clasificación:</h3>
                <div className="flex flex-wrap gap-2">
                  {allCategorias.map((cat, idx) => (
                    <button
                      key={`cat-${idx}`}
                      onClick={() => router.push(`/?c[]=${cat.nombre}`)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      📁 {cat.nombre}
                    </button>
                  ))}
                  {allSubCategorias.map((sub, idx) => (
                    <button
                      key={`sub-${idx}`}
                      onClick={() => router.push(`/?s[]=${sub.nombre}`)}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      📂 {sub.nombre}
                    </button>
                  ))}
                  {tiposProducto.map((tipo, idx) => (
                    <span
                      key={`tipo-${idx}`}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      🏷️ {tipo.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            {(fechaIngreso || garantiaFabrica) && (
              <div className="grid grid-cols-2 gap-4 bg-blue-50 rounded-lg p-4">
                {garantiaFabrica && (
                  <div className="flex items-center gap-2 text-sm">
                    <Award size={16} className="text-blue-600" />
                    <div>
                      <p className="text-gray-600">Garantía de fábrica</p>
                      <p className="font-semibold text-gray-900">{garantiaFabrica} meses</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selector de color */}
            {productoColores.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Color: <span className="text-orange-600">{colorSeleccionado?.color?.nombre || 'Selecciona un color'}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {productoColores.map((pc) => (
                    <button
                      key={pc.idProductoColor}
                      onClick={() => setColorSeleccionado(pc)}
                      disabled={pc.stock === 0}
                      className={`relative group ${pc.stock === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={`${pc.color?.nombre} - ${pc.stock > 0 ? `Stock: ${pc.stock}` : 'Agotado'}`}
                    >
                      <div
                        className={`w-14 h-14 rounded-full border-4 transition-all ${
                          colorSeleccionado?.idProductoColor === pc.idProductoColor
                            ? 'border-orange-500 scale-110 shadow-lg'
                            : 'border-gray-200 hover:border-orange-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: pc.color?.codigoHex || '#ccc' }}
                      />
                      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-2 py-1 rounded">
                        {pc.color?.nombre}
                      </span>
                      {pc.stock === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-0.5 h-16 bg-red-500 rotate-45"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tiendas disponibles */}
            {tiendasDisponibles.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Disponible en {tiendasDisponibles.length} tienda{tiendasDisponibles.length !== 1 ? 's' : ''}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tiendasDisponibles.map((tienda, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-purple-200"
                    >
                      {tienda.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/*Comprar Ahora*/}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || estado === false || addToCartMutation.isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isOutOfStock || estado === false
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-lg hover:shadow-xl'
                }`}
              >
                <ShoppingCart size={24} />
                {addToCartMutation.isLoading
                  ? "Agregando..."
                  : isOutOfStock
                  ? "Producto agotado"
                  : estado === false
                  ? "No disponible"
                  : `Comprar  • ${formatPrice(precioFinal * cantidad)}`}
              </button>
            </div>


            {/* Cantidad y agregar al carrito */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <label className="text-lg font-semibold">Cantidad:</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors font-bold text-lg"
                    disabled={cantidad <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setCantidad(Math.max(1, Math.min(stockDisponible, val)));
                    }}
                    className="w-16 text-center py-3 font-semibold text-lg border-x-2 border-gray-300 focus:outline-none"
                    min="1"
                    max={stockDisponible}
                  />
                  <button
                    onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}
                    disabled={cantidad >= stockDisponible}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  ({stockDisponible} disponible{stockDisponible !== 1 ? 's' : ''})
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || estado === false || addToCartMutation.isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isOutOfStock || estado === false
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-lg hover:shadow-xl'
                }`}
              >
                <ShoppingCart size={24} />
                {addToCartMutation.isLoading
                  ? "Agregando..."
                  : isOutOfStock
                  ? "Producto agotado"
                  : estado === false
                  ? "No disponible"
                  : `Agregar al carrito • ${formatPrice(precioFinal * cantidad)}`}
              </button>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Shield className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-sm">Compra segura</p>
                  <p className="text-xs text-gray-600">Pago protegido</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Award className="text-orange-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-sm">
                    {garantiaFabrica ? `Garantía ${garantiaFabrica} meses` : 'Calidad garantizada'}
                  </p>
                  <p className="text-xs text-gray-600">Soporte post-venta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;