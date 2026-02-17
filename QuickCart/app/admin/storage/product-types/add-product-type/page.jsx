'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProductTypeForm } from '@/hooks/local/useProductTypeForm';
import { useProductTypes, useUpdateProductType, useCreateProductType } from '@/hooks/server/useProductTypes';
import { ProductTypeForm } from '@/components/admin/product-type-form/page';
import toast from 'react-hot-toast';
import { useAuth } from "@/hooks/server/useAuth";

const AddProductTypePage = () => {
  const router = useRouter();
  const { idTipoProducto } = useParams();
  const { token } = useAuth();
  const productTypeForm = useProductTypeForm();

  const { data: productData, isLoading } = useProductTypes(idTipoProducto);

  useEffect(() => {
    if (idTipoProducto && productData) {
      productTypeForm.setFormData(productData); 
    }
  }, [idTipoProducto, productData]);

  const { mutate: createProductType } = useCreateProductType();
  const { mutate: updateProductType } = useUpdateProductType();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!productTypeForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }

    productTypeForm.setIsSubmitting(true);
    
    try {
      const payload = {
        nombre: productTypeForm.formData.nombre,
        estado: productTypeForm.formData.estado,
        idSubCategorias: productTypeForm.formData.idSubCategorias, 
      };

      if (idTipoProducto) {
        // Actualizar
        updateProductType(
          { id: idTipoProducto, productTypeData: payload, token },
          {
            onSuccess: (data) => {
              toast.success('Tipo de Producto actualizado exitosamente');
              productTypeForm.resetForm();
              router.push('/admin/storage/product-types');
            },
            onError: (error) => {
              const errorMessage = error?.response?.data?.message || 'Error al actualizar';
              toast.error(errorMessage);
            },
          }
        );
      } else {
        // Crear
        createProductType(
          { productTypeData: payload, token }, 
          {
            onSuccess: (data) => {
              toast.success('Tipo de Producto creado exitosamente');
              productTypeForm.resetForm();
              router.push('/admin/storage/product-types');
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
      productTypeForm.setIsSubmitting(false);
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
            {idTipoProducto ? 'Editar Tipo de Producto' : 'Agregar Nuevo Tipo de Producto'}
          </h1>
          <p className="text-gray-600 mt-1">
            Los campos marcados con (*) son obligatorios
          </p>
        </div>
        <ProductTypeForm
          {...productTypeForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddProductTypePage;