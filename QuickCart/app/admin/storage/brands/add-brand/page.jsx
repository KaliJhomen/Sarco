'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBrandForm } from '@/hooks/local/useBrandForm';
import { useCreateBrand, useUpdateBrand } from '@/hooks/server/useBrands';
import { BrandForm } from '@/components/admin/brand-form/page';
import toast from 'react-hot-toast';
import { useAuth } from "@/hooks/server/useAuth"; 

const AddBrandPage = () => {
  const router = useRouter();
  const { idMarca } = useParams();
  const { token } = useAuth(); 
  const brandForm = useBrandForm();
  const { mutate: createBrand } = useCreateBrand();
  const { mutate: updateBrand } = useUpdateBrand();

  useEffect(() => {
    if (idMarca) {
    }
  }, [idMarca]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!brandForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }
    brandForm.setIsSubmitting(true);
    try {
      const payload = {
        nombre: brandForm.formData.nombre,
        estado: brandForm.formData.estado,
      };

      if (idMarca) {
        // Actualizar
        updateBrand(
          { id: idMarca, brandData: payload, token },
          {
            onSuccess: (data) => {
              toast.success('Marca actualizada exitosamente');
              brandForm.resetForm();
              router.push('/admin/storage/brands');
            },
            onError: (error) => {
              const errorMessage = error?.response?.data?.message || 'Error al actualizar';
              toast.error(errorMessage);
            },
          }
        );
      } else {
        // Crear
        createBrand(
          { brandData: payload, token },
          {
            onSuccess: (data) => {
              toast.success('Marca creada exitosamente');
              brandForm.resetForm();
              router.push('/admin/storage/brands');
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
      brandForm.setIsSubmitting(false);
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
            {idMarca ? 'Editar Marca' : 'Agregar Nueva Marca'}
          </h1>
          <p className="text-gray-600 mt-1">
            Los campos marcados con (*) son obligatorios
          </p>
        </div>
        <BrandForm
          {...brandForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddBrandPage;