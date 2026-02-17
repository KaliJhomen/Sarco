'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/server/useProducts';
import { ProductForm } from '@/components/admin/product-form/page';
import toast from 'react-hot-toast';

const EditProductPage = () => {
  const router = useRouter();
  const { idProduct } = useParams(); // Updated to match the dynamic route folder name
  const [formData, setFormData] = useState(null);
  const [showColors, setShowColors] = useState(false);

  // Debugging: Log idProduct
  console.log('idProduct:', idProduct);

  // Fetch product data using the useProduct hook
  const { data: productData, isLoading } = useProduct(idProduct); 

  // Debugging: Log productData and isLoading
  console.log('productData:', productData);
  console.log('isLoading:', isLoading);

  useEffect(() => {
    if (productData) {
      setFormData({
        ...productData,
        colores: Array.isArray(productData.colores) ? productData.colores : [],
      });
    }
  }, [productData]);

  useEffect(() => {
    setShowColors(Array.isArray(formData?.colores) && formData.colores.length > 0);
  }, [formData]);

  const handleSubmit = async (data) => {
    try {
      if (idProduct) {
        await useUpdateProduct(idProduct, data); // Updated to use idProduct
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

  if (isLoading) return <div>Cargando...</div>;
  if (!formData) return <div>No se encontró el producto.</div>;

  return (
    <div>
      <h1>Editar Producto</h1>
      <ProductForm initialValues={formData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProductPage;