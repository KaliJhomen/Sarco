import React, { useState } from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname();
  const [miscOpen, setMiscOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [itemReportsOpen, setItemReportsOpen] = useState(false);

  const menuItems = [
    { name: 'Tiendas', path: '/admin/stores/', icon: assets.product_list_icon },
    { name: 'Pedidos', path: '/admin/orders', icon: assets.order_icon },
    { name: 'Gestionar Anuncios', path: '/admin/ads', icon: assets.heart_icon },
  ];
//Cajones 
  const storageItems = [
    { name: 'Productos', path: '/admin/storage/products/', icon: assets.product_list_icon},
    { name: 'Categoría', path : '/admin/storage/categories/', icon: assets.category_icon },
    { name: 'SubCategoría', path : '/admin/storage/subcategories/', icon: assets.category_icon },
    { name: 'Tipo Producto', path: '/admin/storage/product-types/', icon: assets.add_icon },
    { name: 'Marcas', path: '/admin/storage/brands/', icon: assets.product_list_icon},

  ];
  const miscItems = [
    { name: 'Clientes', path: '/admin/misc/clients' },
    { name: 'Logs', path: '/admin/misc/logs' },
    { name: 'Ajustes', path: '/admin/misc/settings' },
  ];
  const reportsItems = [
    { name: 'Productos Vendidos', path: '/admin/itemsReports/products-sold' },
    { name: 'Productos a Crédito', path: '/admin/itemsReports/products-on-credit' },
    { name: 'Productos Reservados', path: '/admin/itemsReports/products-reserved' },
    
  ];

  return (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={
                `flex items-center py-3 px-4 gap-3 cursor-pointer ${isActive
                  ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
                  : "hover:bg-gray-100/90 border-white"
                }`
              }
            >
              {item.icon && (
                <Image
                  src={item.icon}
                  alt={`${item.name.toLowerCase()}_icon`}
                  className="w-7 h-7"
                />
              )}
              <p className='md:block hidden text-center'>{item.name}</p>
            </div>
          </Link>
        );
      })}
      {/*//////////////////// 
         // Storage drawer 
         ////////////////////*/}
      <div className="mt-2">
        <div
          onClick={() => setStorageOpen((s) => !s)}
          role="button"
          className={`flex items-center py-3 px-4 gap-3 cursor-pointer ${pathname.startsWith('/admin/storage')

            ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
            : "hover:bg-gray-100/90 border-white"
          }`}
        >
          <Image src={assets.product_list_icon} alt="storage_icon" className="w-7 h-7" />
          <div className="md:block hidden flex-1">
            <div className="flex items-center justify-between">
              <span className="text-center">Almacén</span>
              <svg
                className={`w-4 h-4 transition-transform ${storageOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Drawer content */}
        <div className={`md:block hidden overflow-hidden transition-all duration-200 ${storageOpen ? 'max-h-48' : 'max-h-0'}`}>
          <div className="ml-12 mt-1 flex flex-col">
            {storageItems.map(mi => {
              const active = pathname === mi.path;
              return (
                <Link key={mi.name} href={mi.path}>
                  <div className={`py-2 px-3 rounded-md text-sm cursor-pointer ${active ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                    {mi.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile / small-screen simple link for Almacén */}
        <Link href="/admin/storage" className="md:hidden block">
          <div className="flex items-center py-3 px-4 gap-3 cursor-pointer hover:bg-gray-100/90">
            <Image src={assets.product_list_icon} alt="almacen_icon" className="w-7 h-7" />
            <p className='text-center'>Almacén</p>
          </div>
        </Link>
      </div>



      {/* ////////////////////
          // Misceláneo drawer 
          ////////////////////*/}
      <div className="mt-2">
        <div
          onClick={() => setMiscOpen((s) => !s)}
          role="button"
          className={`flex items-center py-3 px-4 gap-3 cursor-pointer ${pathname.startsWith('/admin/miscellaneous')
            ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
            : "hover:bg-gray-100/90 border-white"
          }`}
        >
          <Image src={assets.product_list_icon} alt="miscelaneo_icon" className="w-7 h-7" />
          <div className="md:block hidden flex-1">
            <div className="flex items-center justify-between">
              <span className="text-center">Misceláneo</span>
              <svg
                className={`w-4 h-4 transition-transform ${miscOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Drawer content */}
        <div className={`md:block hidden overflow-hidden transition-all duration-200 ${miscOpen ? 'max-h-48' : 'max-h-0'}`}>
          <div className="ml-12 mt-1 flex flex-col">
            {miscItems.map(mi => {
              const active = pathname === mi.path;
              return (
                <Link key={mi.name} href={mi.path}>
                  <div className={`py-2 px-3 rounded-md text-sm cursor-pointer ${active ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                    {mi.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile / small-screen simple link for Misceláneo */}
        <Link href="/admin/miscellaneous" className="md:hidden block">
          <div className="flex items-center py-3 px-4 gap-3 cursor-pointer hover:bg-gray-100/90">
            <Image src={assets.product_list_icon} alt="miscelaneo_icon" className="w-7 h-7" />
            <p className='text-center'>Misceláneo</p>
          </div>
        </Link>
      </div>


      {/* ////////////////////
       // Reportes Items drawer 
          ////////////////////
      */}
      <div className="mt-2">
        <div
          onClick={() => setItemReportsOpen((s) => !s)}
          role="button"
          className={`flex items-center py-3 px-4 gap-3 cursor-pointer ${pathname.startsWith('/admin/itemsReports')
            ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
            : "hover:bg-gray-100/90 border-white"
          }`}
        >
          <Image src={assets.product_list_icon} alt="miscelaneo_icon" className="w-7 h-7" />
          <div className="md:block hidden flex-1">
            <div className="flex items-center justify-between">
              <span className="text-center">Reporte Artículos</span>
              <svg
                className={`w-4 h-4 transition-transform ${itemReportsOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Drawer content */}
        <div className={`md:block hidden overflow-hidden transition-all duration-200 ${itemReportsOpen ? 'max-h-48' : 'max-h-0'}`}>
          <div className="ml-12 mt-1 flex flex-col">
            {reportsItems.map(mi => {
              const active = pathname === mi.path;
              return (
                <Link key={mi.name} href={mi.path}>
                  <div className={`py-2 px-3 rounded-md text-sm cursor-pointer ${active ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                    {mi.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile / small-screen simple link for Misceláneo */}
        <Link href="/admin/miscellaneous" className="md:hidden block">
          <div className="flex items-center py-3 px-4 gap-3 cursor-pointer hover:bg-gray-100/90">
            <Image src={assets.product_list_icon} alt="miscelaneo_icon" className="w-7 h-7" />
            <p className='text-center'>Reporte Articulos</p>
          </div>
        </Link>
      </div>
    </div>

  );
};

export default SideBar;
