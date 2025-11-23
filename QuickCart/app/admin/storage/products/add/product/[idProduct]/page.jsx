'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/server/useProducts';
import {ProductForm} from '@/components/admin/product-form/page';
import toast from 'react-hot-toast';

const EditProductPage = () => {
  const router = useRouter();
  const { idProducto } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    if (idProducto) {
      useProduct(idProducto)
        .then(data => {
          setFormData({
            ...data,
            colores: Array.isArray(data.colores) ? data.colores : [],
          });
        })
        .finally(() => setLoading(false));
    }
  }, [idProducto]);

  useEffect(() => {
    setShowColors(Array.isArray(formData?.colores) && formData.colores.length > 0);
  }, [formData]);

  const handleSubmit = async (data) => {
    try {
      if (idProducto) {
        await useUpdateProduct(idProducto, data);
        toast.success('Producto actualizado exitosamente');
      } else {
        await useCreateProduct(data);
        toast.success('Producto creado exitosamente');
      }
      router.push('/admin/products');
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!formData) return <div>No se encontró el producto.</div>;

  return (
    <div>
      <h1>Editar Producto</h1>
      <ProductForm initialValues={formData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProductPage;