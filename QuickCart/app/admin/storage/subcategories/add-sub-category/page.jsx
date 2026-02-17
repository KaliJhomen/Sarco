'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCreateSubCategory, useUpdateSubCategory, useSubCategoriesById } from '@/hooks/server/useSubCategories';
import { useCategories } from '@/hooks/server/useCategories';
import { SubCategoryForm } from '@/components/admin/subcategory-form/page';
import toast from 'react-hot-toast';
import { useAuth } from "@/hooks/server/useAuth";

const AddSubCategoryPage = () => {
  const router = useRouter();
  const { idSubCategoria } = useParams();
  const { token } = useAuth();
  
  const [formData, setFormData] = React.useState({
    nombre: '',
    estado: true,
    idCategoria: '',
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Cargar datos si es edición
  const { data: subCategoryData, isLoading: loadingSubCategory } = useSubCategoriesById(idSubCategoria);
  
  useEffect(() => {
    if (idSubCategoria && subCategoryData) {
      setFormData({
        nombre: subCategoryData.nombre || '',
        estado: subCategoryData.estado ?? true,
        idCategoria: subCategoryData.idCategoria || '',
      });
    }
  }, [idSubCategoria, subCategoryData]);

  const { mutate: createSubCategory } = useCreateSubCategory();
  const { mutate: updateSubCategory } = useUpdateSubCategory();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre || formData.nombre.trim() === '') {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.idCategoria) {
      newErrors.idCategoria = 'Debe seleccionar una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        nombre: formData.nombre,
        estado: formData.estado,
        idCategoria: Number(formData.idCategoria),
      };

      if (idSubCategoria) {
        // Actualizar
        updateSubCategory(
          { id: idSubCategoria, subCategoryData: payload, token },
          {
            onSuccess: (data) => {
              toast.success('SubCategoría actualizada exitosamente');
              router.push('/admin/storage/subcategories');
            },
            onError: (error) => {
              const errorMessage = error?.response?.data?.message || 'Error al actualizar';
              toast.error(errorMessage);
            },
          }
        );
      } else {
        // Crear
        createSubCategory(
          { subCategoryData: payload, token },
          {
            onSuccess: (data) => {
              toast.success('SubCategoría creada exitosamente');
              router.push('/admin/storage/subcategories');
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
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('¿Seguro que deseas cancelar? Los cambios no guardados se perderán.')) {
      router.back();
    }
  };

  if (loadingSubCategory && idSubCategoria) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {idSubCategoria ? 'Editar SubCategoría' : 'Agregar Nueva SubCategoría'}
          </h1>
          <p className="text-gray-600 mt-1">
            Los campos marcados con (*) son obligatorios
          </p>
        </div>
        <SubCategoryForm
          formData={formData}
          errors={errors}
          updateField={updateField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddSubCategoryPage;