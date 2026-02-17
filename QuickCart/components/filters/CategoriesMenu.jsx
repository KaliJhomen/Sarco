'use client'
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams, useRouter } from "next/navigation";

const CategoriesMenu = ({ className = "", horizontal = false }) => {
  const { products, categoriesMenu } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeQ = (searchParams.get("q") || "").toLowerCase();
  const activeC = (searchParams.get("c") || "").toLowerCase();
  const activeS = (searchParams.get("s") || "").toLowerCase();

  const groupMenu = (categoriesMenu || []).find(
    (m) => (m?.title || "").toLowerCase() === activeC
  );
  const subcategories = groupMenu ? (groupMenu.columns || []).map((col) => col.title) : [];

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort();

  const goToCategory = (cat) => {
    router.push(`/shop/products?q=${encodeURIComponent(cat)}`);
  };

  const ulBase = horizontal
    ? `flex flex-wrap gap-3 list-none p-0 ${className}`
    : `bg-white border border-gray-300 rounded-md shadow-sm py-2 max-h-[60vh] overflow-y-auto ${className}`;

  const itemClass = (isActive) =>
    horizontal
      ? `px-4 py-2 bg-gray-100 rounded-md text-gray-700 text-base md:text-lg hover:bg-orange-100 transition ${
          isActive ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200" : ""
        }`
      : `flex w-full items-center justify-between px-4 py-2 text-sm md:text-base transition hover:bg-orange-50 ${
          isActive ? "bg-orange-50 text-orange-700" : "text-gray-700"
        }`;

  if (groupMenu) {
    return (
      <ul className={ulBase}>
        {subcategories.map((sub) => {
          const isActive = activeS && sub.toLowerCase() === activeS;
          return (
            <li key={sub}>
            <div
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/shop/products?c=${encodeURIComponent(groupMenu.title)}&s=${encodeURIComponent(sub)}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push(`/shop/products?c=${encodeURIComponent(groupMenu.title)}&s=${encodeURIComponent(sub)}`); }}
                className={itemClass(isActive)}
                title={sub}
              >
                <span className="truncate">{sub}</span>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={ulBase}>
      {categories.map((cat) => {
        const isActive = activeQ && cat.toLowerCase() === activeQ;
        return (
          <li key={cat}>
            <div role="button" tabIndex={0} onClick={() => goToCategory(cat)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToCategory(cat); }} className={itemClass(isActive)}>
              <span className="truncate">{cat}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default CategoriesMenu;