'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProductForm } from '@/hooks/local/useProductForm';
import { categoryService } from '@/services/category.service';
import { ProductForm } from '@/components/admin/product-form/page';
import toast from 'react-hot-toast';
import { useImageUpload } from "@/hooks/local/useImageUpload";

const AddCategoryPage = () => {
  const router = useRouter();
  const { idCategoria } = useParams();
  const categoryForm = useCategoryForm();

  // Si hay idCategoria, carga los datos de la categoría
  useEffect(() => {
    if (idCategoria) {
      categoryService.getById(idCategoria)
        .then(data => {
          productForm.setFormData(data); 
        })
        .catch(() => toast.error('No se pudo cargar el producto'));
    }
  }, [idProducto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }
    categoryForm.setIsSubmitting(true);

    try {
      const { idTiposProducto, ...categoriaPayload } = categoryForm.formData;
      let SubCategoriasArray = Array.isArray(idSubCategorias) ? idSubCategorias : [idSubCategorias];

      let result;
      if (idCategoria) {
        // 👈 Si hay idCategoria, actualiza
        result = await categoryService.update(idCategoria, { ...categoriaPayload, idSubCategorias: SubCategoriasArray });
        toast.success('Categoría actualizada exitosamente');
      } else {
        // 👈 Si no hay idCategoria, crea
        result = await categoryService.create({ ...categoriaPayload, idSubCategorias: SubCategoriasArray });
        toast.success('Categoría creada exitosamente');
      }

      categoryForm.resetForm();
      router.push(`/admin/categories/${result.id || result.idCategoria}`);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error al guardar el producto';
      toast.error(errorMessage);
      return false;
    } finally {
      categoryForm.setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Seguro que deseas cancelar? Los cambios no guardados se perderán.')) {
      router.back();
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {idCategoria ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
          </h1>
          <p className="text-gray-600 mt-1">
            Los campos marcados con (*) son obligatorios
          </p>
        </div>
        <CategoryForm
          {...categoryForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddCategoryPage;