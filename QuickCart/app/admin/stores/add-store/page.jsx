'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStoreForm } from '@/hooks/local/useStoreForm';
import { useCreateStore, useUpdateStore, useStore } from '@/hooks/server/useStores';
import { StoreForm } from '@/components/admin/store-form/page';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/server/useAuth';

const AddStorePage = () => {
  const router = useRouter();
  const { idTienda } = useParams(); 
  const { token } = useAuth();  
  const storeForm = useStoreForm();
  const { mutate: createStore } = useCreateStore();
  const { mutate: updateStore } = useUpdateStore();
  const { data: existingStore } = useStore(idTienda);

  useEffect(() => {
    if (existingStore) {
      // map backend fields to form
      storeForm.setFormData({
        nombre: existingStore.nombre || '',
        direccion: existingStore.direccion || '',
        condicion: existingStore.condicion ?? true,
      });
    }
  }, [existingStore]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!storeForm.validate()) {
      toast.error('Por favor completa los campos requeridos correctamente');
      return false;
    }
    storeForm.setIsSubmitting(true);
    try {
      const payload = {
        nombre: storeForm.formData.nombre,
        direccion: storeForm.formData.direccion,
        condicion: storeForm.formData.condicion ,
      };

      if (idTienda) {
        updateStore(
          { id: idTienda, storeData: payload, token },
          {
            onSuccess: () => {
              toast.success('Tienda actualizada exitosamente');
              storeForm.resetForm();
              router.push('/admin/stores');
            },
            onError: (error) => {
              const errorMessage = error?.response?.data?.message || 'Error al actualizar';
              toast.error(errorMessage);
            },
          }
        );
      } else {
        createStore(
          { storeData: payload, token },
          {
            onSuccess: () => {
              toast.success('Tienda creada exitosamente');
              storeForm.resetForm();
              router.push('/admin/stores');
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
      storeForm.setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold text-gray-900">{idTienda ? 'Editar Tienda' : 'Agregar Nueva Tienda'}</h1>
          <p className="text-gray-600 mt-1">Los campos marcados con (*) son obligatorios</p>
        </div>

        <StoreForm
          {...storeForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddStorePage;