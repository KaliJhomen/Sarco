'use client';
import client from '@/services/api/client';
import React, { useRef, useState } from 'react';
import { Package, Loader2, Image as ImageIcon } from 'lucide-react';

import { useCreateCategory } from '@/hooks/server/useCategories';
import { useSubCategories } from '@/hooks/server/useSubCategories';
import { useAuth } from "@/hooks/server/useAuth";

import { useImageUpload } from '@/hooks/local/useImageUpload';



export const BasicInfoSection = ({
  formData,
  errors,
  updateField,
}) => {
  const fileInputRef = useRef();
  const { data: subCategories= [], isLoading: loadingSubCategories} = useSubCategories();

  // Subcategorías filtradas


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
        {/* Nombre de la Categoria*/}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Categoria <span className="text-red-500">*</span>
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
            >
              <option value="">
                  Seleccionar Sub-categoría
              </option>
              {subCategories.map((subCategoria) => (
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
        
        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Por siaca(Opcional):
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