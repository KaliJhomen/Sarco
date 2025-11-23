'use client';
import client from '@/services/api/client';
import React, { useRef, useState } from 'react';
import { Package, Loader2, Image as ImageIcon } from 'lucide-react';
import { useBrands } from '@/hooks/server/useBrands';

import { useCategories } from '@/hooks/server/useCategories';

import { useSubCategories } from '@/hooks/server/useSubCategories';
import { useSubCategoriesByCategoryId } from '@/hooks/server/useSubCategories';

import { useProductTypeProduct} from '@/hooks/server/useProductTypeProducts';

import { useProductTypes } from '@/hooks/server/useProductTypes';
import { useProductTypesBySubCategoryId} from '@/hooks/server/useProductTypes';
import { useAuth } from "@/hooks/server/useAuth";

import { useStores } from '@/hooks/server/useStores';
import { useImageUpload } from '@/hooks/local/useImageUpload';
import { useColors} from '@/hooks/server/useColors';



export const BasicInfoSection = ({
  formData,
  errors,
  updateField,
}) => {
  const { data: brands = [], isLoading: loadingBrands } = useBrands();
  const { data: productTypes = [], isLoading: loadingproductTypes } = useProductTypes();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: subCategories= [], isLoading: loadingSubCategories} = useSubCategories();
  const { data: stores = [], isLoading: loadingStores } = useStores();
  const { data: colors = [], isLoading: loadingColors } = useColors();
  const fileInputRef = useRef();
  const categoriaId = formData.idCategoria || '';
  const subCategoriaId = formData.idSubCategoria || '';
  const tipoProductoId = formData.idTipoProducto || '';

  // Subcategorías filtradas
  const { data: subCategoriesByCategoryId = [], isLoading: loadingSubCategoriesByCategoryId } = useSubCategoriesByCategoryId(categoriaId);

  // Tipos de producto filtrados 
  const { data: productTypesBySubCategoryId = [], isLoading: loadingProductTypesBySubCategoryId } = useProductTypesBySubCategoryId(subCategoriaId);

  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [productTypeId, setProductTypeId] = useState('');
  const [subCategoria, setSubCategoria] = useState([]);

  
  const { uploadImage, uploading, error } = useImageUpload();
  const { token } = useAuth(); 

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file, token);
    
    if (url) {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
      const imageUrl = url.startsWith("http")
        ? url
      : `${BASE_URL}${url}`; 
      updateField('imagen', imageUrl);
    }
  };

  // Convierte los valores de los selects a número (o vacío)
  const handleSelectNumber = (field) => (e) => {
    const value = e.target.value;
    updateField(field, value === "" ? "" : Number(value));
  };

  const handleCategoriaChange = (e) => {
    const selectedCategoriaId = e.target.value;
    setCategoriaId(selectedCategoriaId);
    updateField('idCategoria', selectedCategoriaId);

    if (selectedCategoriaId) {
      const selectedCategoria = categories.find(cat => cat.idCategoria === Number(selectedCategoriaId));
      setSubcategorias(selectedCategoria ? selectedCategoria.subcategorias : []);
    } else {
      setSubcategorias([]);
      updateField('idSubCategoria', '');
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Package className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre del Producto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder='NOMBRE'
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.nombre}
            onChange={(e) => updateField('nombre', e.target.value)}
          />
          {errors?.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo 
          </label>
          <input
            type="text"
            placeholder="MODELO DEL PRODUCTO"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.modelo ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.modelo}
            onChange={(e) => updateField('modelo', e.target.value)}
          />
          {errors?.modelo && (
            <p className="text-red-500 text-sm mt-1">{errors.modelo}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Inicial<span> (Opcional):</span>
          </label>
          <input
            type="number"
            min={0}
            placeholder="STOCK INICIAL"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.stock}
            onChange={(e) => updateField('stock', e.target.value)}
          />
          {errors?.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
          )}
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors?.marca || errors?.idMarca ? 'border-red-500' : 'border-gray-300'
              } ${loadingBrands ? 'opacity-50' : ''}`}
              value={formData.idMarca || ""}
              onChange={handleSelectNumber('idMarca')}
              disabled={loadingBrands}
            >
              <option value="">
                {loadingBrands ? 'Cargando marcas...' : 'Seleccionar marca'}
              </option>
              {brands.map((marca) => (
                <option key={marca.idMarca} value={marca.idMarca}>
                  {marca.nombre}
                </option>
              ))}
            </select>
            {loadingBrands && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {(errors?.marca || errors?.idMarca) && (
            <p className="text-red-500 text-sm mt-1">{errors.marca || errors.idMarca}</p>
          )}
        </div>


        {/* Categoría*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors?.categoria || errors?.idCategoria ? 'border-red-500' : 'border-gray-300'
              } ${loadingCategories ? 'opacity-50' : ''}`}
              value={formData.idCategoria || ""}
              onChange={handleSelectNumber('idCategoria')}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? 'Cargando categorías...' : 'Seleccionar categoría'}
              </option>
              {categories.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {loadingCategories && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {(errors?.categoria || errors?.idCategoria) && (
            <p className="text-red-500 text-sm mt-1">{errors.categoria || errors.idCategoria}</p>
          )}
        </div>
        {/* Sub-Categoría*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-Categoría <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors?.subCategoria || errors?.idSubCategoria ? 'border-red-500' : 'border-gray-300'
              } ${loadingSubCategories ? 'opacity-50' : ''}`}
              value={formData.idSubCategoria || ""}
              onChange={handleSelectNumber('idSubCategoria')}
              disabled={!categoriaId || loadingSubCategoriesByCategoryId}
            >
              <option value="">
                {loadingSubCategoriesByCategoryId
                  ? 'Cargando Sub-categorías...'
                  : 'Seleccionar Sub-categoría'}
              </option>
              {subCategoriesByCategoryId.map((subCategoria) => (
                <option key={subCategoria.idSubCategoria} value={subCategoria.idSubCategoria}>
                  {subCategoria.nombre}
                </option>
              ))}
            </select>
            {loadingSubCategories && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {(errors?.subCategoria || errors?.idSubCategoria) && (
            <p className="text-red-500 text-sm mt-1">{errors.subCategoria || errors.idSubCategoria}</p>
          )}
        </div>
        {/* Tipo Producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo Producto <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors?.tipoProducto || errors?.idTipoProducto ? 'border-red-500' : 'border-gray-300'
              } ${loadingproductTypes ? 'opacity-50' : ''}`}
              value={formData.idTiposProducto[0] || ""}
              onChange={e => updateField('idTiposProducto', [Number(e.target.value)])}
              disabled={!subCategoriaId || loadingProductTypesBySubCategoryId}
            >
              <option value="">
                {loadingProductTypesBySubCategoryId
                  ? 'Cargando tipos de producto...'
                  : 'Seleccionar tipo de producto'}
              </option>
              {productTypesBySubCategoryId.map((tipoProducto) => (
                <option key={tipoProducto.idTipoProducto} value={tipoProducto.idTipoProducto}>
                  {tipoProducto.nombre}
                </option>
              ))}
            </select>
            {loadingproductTypes && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {(errors?.tipoProducto || errors?.idTipoProducto) && (
            <p className="text-red-500 text-sm mt-1">{errors.tipoProducto || errors.idTipoProducto}</p>
          )}
        </div>
        {/* Imagen principal */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen principal 
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = await uploadImage(file, token);
                  if (imageUrl) {
                    updateField('imagen', imageUrl);
                  }
                }
              }}
            />
            {uploading && <span>Subiendo imagen...</span>}
            {error && <span className="text-red-500">{error}</span>}
            {formData.imagen && (
              <div className="w-24 h-24 border rounded overflow-hidden flex items-center justify-center bg-gray-50">
                <img
                  src={formData.imagen}
                  alt="Previsualización"
                  className="object-contain w-full h-full"
                />
              </div>
            )}
          </div>
          {errors?.imagen && (
            <p className="text-red-500 text-sm mt-1">{errors.imagen}</p>
          )}
        </div>
        {/* Color (Opcional) */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color (Opcional)
            </label>
            <div className="relative">
              <select
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors?.idColor ? 'border-red-500' : 'border-gray-300'
                } ${loadingColors ? 'opacity-50' : ''}`}
                value={formData.idColor || ""}
                onChange={handleSelectNumber('idColor')}
                disabled={loadingColors}
              >
                <option value="">
                  {loadingColors ? 'Cargando colores...' : 'Seleccionar color'}
                </option>
                {colors.map((color) => (
                  <option key={color.idColor} value={color.idColor}>
                    {color.nombre}
                  </option>
                ))}
              </select>
              {loadingColors && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
              )}
            </div>
            {errors?.idColor && (
              <p className="text-red-500 text-sm mt-1">{errors.idColor}</p>
            )}
          </div>
          {/* Vista previa del color */}
          <div className="flex items-center h-full mt-6">
            {formData.idColor && (
              (() => {
                const selected = colors.find(c => c.idColor === Number(formData.idColor));
                return selected ? (
                  <div
                    title={selected.nombre}
                    className="w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: selected.codigoHex || '#fff' }}
                  />
                ) : null;
              })()
            )}
          </div>
        </div>
        {/* Tienda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tienda 
          </label>
          <div className="relative">
            <select
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors?.tienda || errors?.idTienda ? 'border-red-500' : 'border-gray-300'
              } ${loadingStores ? 'opacity-50' : ''}`}
              value={formData.idTienda || ""}
              onChange={handleSelectNumber('idTienda')}
              disabled={loadingStores}
            >
              <option value="">
                {loadingStores ? 'Cargando tiendas...' : 'Seleccionar tienda'}
              </option>
              {stores.map((tienda) => (
                <option key={tienda.idTienda} value={tienda.idTienda}>
                  {tienda.nombre}
                </option>
              ))}
            </select>
            {loadingStores && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {(errors?.tienda || errors?.idTienda) && (
            <p className="text-red-500 text-sm mt-1">{errors.tienda || errors.idTienda}</p>
          )}
        </div>
        {/* Fecha de Ingreso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Ingreso <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.fechaIngreso ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.fechaIngreso || ''}
            onChange={e => updateField('fechaIngreso', e.target.value)}
          />
          {errors?.fechaIngreso && (
            <p className="text-red-500 text-sm mt-1">{errors.fechaIngreso}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (Opcional):
          </label>
          <textarea
            rows="4"
            placeholder="Descripción detallada del producto..."
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${
              errors?.descripcion ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.descripcion}
            onChange={(e) => updateField('descripcion', e.target.value)}
          />
          {errors?.descripcion && (
            <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
          )}
        </div>
      </div>
    </div>
  );
};