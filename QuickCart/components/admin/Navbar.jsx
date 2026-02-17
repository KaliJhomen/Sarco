import React, { useContext, useState, useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { AuthContext } from '@/context/AuthContext';

const Navbar = () => {
  const { router } = useAppContext();
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Cierra el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleProfile = () => {
    setOpen(false);
    router.push('/admin/user');
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  return (
    <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Image
          onClick={() => router.push('/')}
          className="w-28 lg:w-32 cursor-pointer"
          src={assets.logo}
          alt="logo"
        />
      </div>

      {/* Botón de usuario */}
      <div className="relative flex items-center gap-3" ref={menuRef}>
        <button
          onClick={handleToggle}
          className="flex items-center bg-black gap-2 px-4 py-2 hover:bg-black/20 rounded-full transition-all duration-300 font-medium text-white backdrop-blur-sm"
        >
          <Image
            className="w-5 h-5 brightness-100 invert"
            src={assets.user_icon}
            alt="user icon"
            width={20}
            height={20}
          />
          <span className="hidden lg:inline font-bold">{user.nombre}</span>
        </button>

        {/* Menú desplegable */}
        <div
          className={`absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-[9999] transition-all duration-300 transform ${
            open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="py-2">
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
      </div>
    </div>
  );
};

export default Navbar;