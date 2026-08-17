"use client"
import React, { useContext, useState, useRef, useMemo, useEffect } from "react";
import { assets } from "@/assets/assets";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useCategories } from "@/hooks/server/useCategories";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const menuRef = useRef(null);
  const router = useRouter();
  const { isSeller } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const hideTimeout = useRef(null);
  const [open, setOpen] = useState(false);

  const { cliente, isAuthenticated, logout } = useContext(AuthContext);
  const handleToggle = () => setOpen((s) => !s);
  const handleProfile = () => {
    setOpen(false);
    router.push("/cliente/profile");
  };
  /*
  // Verifica si el usuario es administrador o gerente
  const isAdminOrManager = useMemo(() => ["Administrador", "Gerente"].includes(cliente?.role), [cliente]);


  const handleAdminPanel = () => {
    setOpen(false);
    router.push("/admin");
  };
*/
  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 overflow-visible shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Elementos decorativos flotantes */}
        <div className="absolute top-0 right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>

        <div className="relative flex items-center justify-between px-6 md:px-16 lg:px-32 py-4">
          {/* Logo */}
          <Image
            className="cursor-pointer w-28 md:w-52 hover:scale-105 transition-transform duration-300"
            onClick={() => router?.push("/")}
            src={assets.logo}
            alt="logo"
            width={208}
            height={56}
            priority
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-red-100 transition-colors duration-300 font-bold relative group">
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/shop/productos" className="text-white hover:text-red-100 transition-colors duration-300 font-bold relative group">
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/shop/ofertas" className="text-white hover:text-red-100 transition-colors duration-300 font-bold relative group">
              Ofertas
              <span className="absolute -top-1 -right-3 bg-gradient-to-r from-yellow-300 to-orange-400 text-red-900 text-xs px-1.5 py-0.5 rounded-full font-black shadow-lg animate-pulse">
                🔥
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/shop/electrodomesticos" className="text-white hover:text-red-100 transition-colors duration-300 font-bold relative group">
              Electrodomésticos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/shop/muebleria" className="text-white hover:text-red-100 transition-colors duration-300 font-bold relative group">
              Mueblería
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/shop/movilidad" className="text-white hover:text-red-100 transition-colors duration-300 font-bold relative group">
              Movilidad
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm">
              <Image className="w-5 h-5 brightness-0 invert" src={assets.search_icon} alt="search icon" width={20} height={20} />
            </button>
            <Link href="/cliente/favorites" className="text-white hover:text-red-100 transition-colors duration-300 font-bold relative group">
              Favoritos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/cliente/cart"
              aria-label="Carrito"
              title="Carrito"
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 text-white"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="17" cy="20" r="1" />
                <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" />
              </svg>
            </Link>
            <div className="relative flex items-center gap-3" ref={menuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleToggle}
                    className="flex items-center bg-black gap-2 px-4 py-2 hover:bg-black/20 rounded-full transition-all duration-300 font-medium text-white backdrop-blur-sm"
                  >
                    <Image
                      className="w-5 h-5 brightness-100 invert"
                      src={assets.cliente_icon}
                      alt="cliente icon"
                      width={20}
                      height={20}
                    />
                    
                    <span className="hidden lg:inline font-bold">{cliente?.nombre}</span>
                  </button>

                  {open && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-[9999] transition-transform duration-300 ${
                        open ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    >
                      <div className="py-2">
                        {/*}
                        {isAdminOrManager && (
                          <button
                            onClick={handleAdminPanel}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Panel Administración
                          </button>
                        )}
                        */}
                        <button
                          onClick={handleProfile}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mi perfil
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center bg-black gap-2 px-4 py-2 hover:bg-black/20 rounded-full transition-all duration-300 font-medium text-white"
                >
                  <Image
                    className="w-5 h-5 brightness-100 invert"
                    src={assets.cliente_icon}
                    alt="cliente icon"
                    width={20}
                    height={20}
                  />
                  <span className="hidden lg:inline font-bold">Ingresar</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;