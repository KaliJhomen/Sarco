'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProductForm } from '@/hooks/local/useProductForm';
import { productTypeProductService } from '@/services/productTypeProduct.service';
import {useProducts, useProduct, useProductsById, useCreateProduct} from '@/hooks/server/useProducts';
import { ProductForm } from '@/components/admin/product-form/page';
import toast from 'react-hot-toast';
import { useImageUpload } from "@/hooks/local/useImageUpload";

const AddProductPage = () => {
  const router = useRouter();
  const { idProducto } = useParams();
  const productForm = useProductForm();

  // Si hay idProducto, carga los datos del producto
  useEffect(() => {
    if (idProducto) {
      useProduct(idProducto)
        .then(data => {
          productForm.setFormData(data); 
        })
        .catch(() => toast.error('No se pudo cargar el producto'));
    }
  }, [idProducto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos correctamente');
      return false;
    }
    productForm.setIsSubmitting(true);

    try {
      const { idTiposProducto, ...productoPayload } = productForm.formData;
      let tiposProductoArray = Array.isArray(idTiposProducto) ? idTiposProducto : [idTiposProducto];

      let result;
      if (idProducto) {
        result = await useUpgateProduct(idProducto, { ...productoPayload, idTiposProducto: tiposProductoArray });
        toast.success('Producto actualizado exitosamente');
      } else {
        result = await useCreateProduct({ ...productoPayload, idTiposProducto: tiposProductoArray });
        toast.success('Producto creado exitosamente');
      }

      productForm.resetForm();
      router.push(`/admin/products/${result.id || result.idProducto}`);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error al guardar el producto';
      toast.error(errorMessage);
      return false;
    } finally {
      productForm.setIsSubmitting(false);
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
            {idProducto ? 'Editar Producto' : 'Agregar Nueva Categoria'}
          </h1>
          <p className="text-gray-600 mt-1">
            Los campos marcados con (*) son obligatorios
          </p>
        </div>
        <ProductForm
          {...productForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddProductPage;