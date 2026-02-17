'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdForm } from '@/hooks/local/useAdForm';
import { useUpdateAd, useAdS } from '@/hooks/server/useAds';
import { AdForm } from '@/components/admin/ad-form/page';
import toast from 'react-hot-toast';
import { useAuth } from "@/hooks/server/useAuth";

const EditAdPage = () => {
  const router = useRouter();
  const { idAnuncio } = useParams();
  const { token } = useAuth();
  const adForm = useAdForm();

  // Cargar datos del anuncio
  const { data: adData, isLoading } = useAds(idAnuncio, token);

  useEffect(() => {
    if (idAnuncio && adData) {
      adForm.setFormData({
        titulo: adData.titulo || '',
        imagen: adData.imagen || '',
        urlDestino: adData.urlDestino || '',
        orden: adData.orden ?? 0,
        estado: adData.estado ?? true,
      });
    }
  }, [idAnuncio, adData]);

  const { mutate: updateAd } = useUpdateAd();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!adForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }

    adForm.setIsSubmitting(true);

    try {
      const payload = {
        titulo: adForm.formData.titulo,
        imagen: adForm.formData.imagen,
        urlDestino: adForm.formData.urlDestino || null,
        orden: adForm.formData.orden ?? 0,
        estado: adForm.formData.estado,
      };

      updateAd(
        { id: idAnuncio, data: payload, token },
        {
          onSuccess: (data) => {
            toast.success('Anuncio actualizado exitosamente');
            adForm.resetForm();
            router.push('/admin/ads');
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
      adForm.setIsSubmitting(false);
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
        <div className="text-lg text-gray-600">Cargando anuncio...</div>
      </div>
    );
  }

  if (!adData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">No se encontró el anuncio</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Anuncio
          </h1>
          <p className="text-gray-600 mt-1">
            Los campos marcados con (*) son obligatorios
          </p>
        </div>
        <AdForm
          {...adForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditAdPage;