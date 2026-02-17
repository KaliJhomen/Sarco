'use client';
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AppContext = createContext();
const defaultCurrency = process.env.NEXT_PUBLIC_CURRENCY || '$';

const normalizeItem = (item) => {
  if (!item) return null;
  if (typeof item === 'object') {
    const id = item.id || item._id || item.idProducto || item.productId;
    if (!id) return null;
    return {
      id,
      name: item.nombre || item.name || item.title || 'Producto',
      price: Number(item.precio ?? item.price ?? item.offerPrice ?? item.precioVenta ?? 0) || 0,
      image: Array.isArray(item.image)
        ? item.image[0]
        : item.image || item.imagen || item.images?.[0] || item.imgSrc,
    };
  }
  return { id: item, name: 'Producto', price: 0 };
};

export function AppProvider({ children }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(() => {
    // Cargar carrito desde localStorage al iniciar
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : {};
    }
    return {};
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [theme, setTheme] = useState('light');
  const [categoriesMenu, setCategoriesMenu] = useState([]);
  const [isSeller, setIsSeller] = useState(false);

  const normalize = useCallback((str) => {
    if (!str || typeof str !== 'string') return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }, []);

  const addToCart = useCallback((item, quantity = 1) => {
    setCartItems((prev) => {
      const parsed = normalizeItem(item);
      if (!parsed) return prev;
      const current = prev[parsed.id] || parsed;
      const nextQty = Math.max((current.quantity || 0) + quantity, 0);
      if (nextQty === 0) {
        const { [parsed.id]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [parsed.id]: { ...current, ...parsed, quantity: nextQty },
      };
    });
  }, []);

  const updateCartQuantity = useCallback((itemId, quantity) => {
    setCartItems((prev) => {
      if (!itemId) return prev;
      const safeQty = Math.max(Number(quantity) || 0, 0);
      if (safeQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      const current = prev[itemId] || { id: itemId, name: 'Producto', price: 0 };
      return { ...prev, [itemId]: { ...current, quantity: safeQty } };
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => setCartItems({}), []);

  const getCartCount = useCallback(
    () => Object.values(cartItems).reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  );

  const getCartAmount = useCallback(
    () => Object.values(cartItems).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0),
    [cartItems]
  );

  const products = useMemo(
    () =>
      Object.values(cartItems).map((item) => ({
        _id: item.id,
        name: item.name,
        offerPrice: item.price || 0,
        image: item.image ? [item.image] : ['/productos/placeholder.svg'],
      })),
    [cartItems]
  );

  // Guardar carrito en localStorage al cambiar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const value = {
    // UI state
    sidebarOpen,
    setSidebarOpen,
    viewMode,
    setViewMode,
    theme,
    setTheme,
    categoriesMenu,
    setCategoriesMenu,
    isSeller,
    setIsSeller,

    // Cart state
    cartItems,
    products,
    currency: defaultCurrency,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartCount,
    getCartAmount,

    // Utils
    normalize,
    router,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext debe usarse dentro de AppProvider');
  return context;
}