'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStoreForm } from '@/hooks/local/useStoreForm';
import { useUpdateStore, useStore } from '@/hooks/server/useStores';
import { StoreForm } from '@/components/admin/store-form/page';
import toast from 'react-hot-toast';
import { useAuth } from "@/hooks/server/useAuth";

const EditStorePage = () => {
  const router = useRouter();
  const { idStore } = useParams();
  const { token } = useAuth();
  const storeForm = useStoreForm();

  // Cargar datos de la marca
  const { data: storeData, isLoading } = useStore(idStore);

  useEffect(() => {
    if (idStore && storeData) {
      StoreForm.setFormData({
        nombre: StoreForm.nombre || '',
        condicion: storeData.condicion ?? true,
      });
    }
  }, [idStore, storeData]);

  const { mutate: updateStore } = useUpdateStore();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!storeForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }

    StoreForm.setIsSubmitting(true);

    try {
      const payload = {
        nombre: StoreForm.formData.nombre,
        condicion: StoreForm.formData.condicion,
      };

      updateStore(
        { id: idStore, storeData: payload, token },
        {
          onSuccess: (data) => {
            toast.success('Tienda actualizada exitosamente');
            StoreForm.resetForm();
            router.push('/admin/storage/stores');
          },
          onError: (error) => {
            const errorMessage = error?.response?.data?.message || 'Error al actualizar';
            toast.error(errorMessage);
          },
        }
      );

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Cargando tienda...</div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">No se encontró la tienda</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Tienda
          </h1>
          <p className="text-gray-600 mt-1">
            Los campos marcados con (*) son obligatorios
          </p>
        </div>
        <StoreForm
          {...StoreForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditStorePage;