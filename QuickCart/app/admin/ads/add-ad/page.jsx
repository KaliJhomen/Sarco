'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdForm } from '@/hooks/local/useAdForm';
import { useCreateAd, useUpdateAd } from '@/hooks/server/useAds';
import { AdForm } from '@/components/admin/ad-form/page';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/server/useAuth';

const AddAdPage = () => {
  const router = useRouter();
  const { idAnuncio } = useParams();
  const { token } = useAuth();
  const adForm = useAdForm();
  const { mutate: createAd } = useCreateAd();
  const { mutate: updateAd } = useUpdateAd();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!adForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }
    adForm.setIsSubmitting(true);

    const payload = {
      titulo: adForm.formData.titulo,
      imagen: adForm.formData.imagen,
      urlDestino: adForm.formData.urlDestino || null,
      orden: adForm.formData.orden ?? 0,
      estado: adForm.formData.estado,
    };

    const onError = (error) => {
      const errorMessage = error?.response?.data?.message || 'Error al guardar';
      toast.error(errorMessage);
    };

    if (idAnuncio) {
      updateAd(
        { id: idAnuncio, data: payload, token },
        {
          onSuccess: () => {
            toast.success('Anuncio actualizado exitosamente');
            adForm.resetForm();
            router.push('/admin/ads');
          },
          onError,
        }
      );
    } else {
      createAd(
        { formData: payload, token },
        {
          onSuccess: () => {
            toast.success('Anuncio creado exitosamente');
            adForm.resetForm();
            router.push('/admin/ads');
          },
          onError,
        }
      );
    }

    adForm.setIsSubmitting(false);
    return true;
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
            {idAnuncio ? 'Editar Anuncio' : 'Agregar Nuevo Anuncio'}
          </h1>
          <p className="text-gray-600 mt-1">Los campos marcados con (*) son obligatorios</p>
        </div>
        <AdForm {...adForm} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddAdPage;