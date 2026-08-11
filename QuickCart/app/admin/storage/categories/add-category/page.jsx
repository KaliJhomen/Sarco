'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCategoryForm } from '@/hooks/local/useCategoryForm';
import { useCreateCategory, useUpdateCategory } from '@/hooks/server/useCategories';
import { CategoryForm } from '@/components/admin/category-form/page';
import toast from 'react-hot-toast';
import { useAuth } from "@/hooks/server/useAuth"; 

const AddCategoryPage = () => {
  const router = useRouter();
  const { idCategoria } = useParams();
  const { token } = useAuth(); 
  const categoryForm = useCategoryForm();

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();

  useEffect(() => {
    if (idCategoria) {
    }
  }, [idCategoria]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!categoryForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }
    categoryForm.setIsSubmitting(true);

    try {
      const payload = {
        nombre: categoryForm.formData.nombre,
        estado: categoryForm.formData.estado,
      };

      if (idCategoria) {
        // Actualizar
        updateCategory(
          { id: idCategoria, categoryData: payload, token },
          {
            onSuccess: (data) => {
              toast.success('Categoría actualizada exitosamente');
              categoryForm.resetForm();
              router.push('/admin/storage/categories');
            },
            onError: (error) => {
              const errorMessage = error?.response?.data?.message || 'Error al actualizar';
              toast.error(errorMessage);
            },
          }
        );
      } else {
        // Crear
        createCategory(
          { categoryData: payload, token },
          {
            onSuccess: (data) => {
              toast.success('Categoría creada exitosamente');
              categoryForm.resetForm();
              router.push('/admin/storage/categories');
            },
            onError: (error) => {
              const errorMessage = error?.response?.data?.message || 'Error al crear';
              toast.error(errorMessage);
            },
          }
        );
      }

      return true;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error inesperado';
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