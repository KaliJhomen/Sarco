'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProductForm } from '@/hooks/local/useProductForm';
import { useProduct, useUpdateProduct, useCreateProduct } from '@/hooks/server/useProducts';
import { ProductForm } from '@/components/admin/product-form/page';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal'; // Import the modal component
import withAuth from '@/components/common/withAuth'; // Import the HOC

const AddProductPage = () => {
  const router = useRouter();
  const { idProducto } = useParams();
  const productForm = useProductForm();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: productData, isLoading } = useProduct(idProducto);

  const [isTokenInvalid, setIsTokenInvalid] = useState(false); // State to control the modal visibility

  // Si hay idProducto, carga los datos del producto
  useEffect(() => {
    if (idProducto && productData) {
      productForm.setFormData(productData); 
    }
  }, [idProducto, productData]);

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

      if (idProducto) {
        console.log("Updating product with payload:", { ...productoPayload, idTiposProducto: tiposProductoArray });
        updateProduct(
          { 
            id: idProducto, 
            data: { ...productoPayload, idTiposProducto: tiposProductoArray },
            token: undefined 
          },
          {
            onSuccess: (response) => {
              const data = response?.data || response;
              console.log("Product updated successfully:", data);
              toast.success('Producto actualizado exitosamente');
              productForm.resetForm();
              router.push(`/admin/products/${data.id || data.idProducto}`);
            },
            onError: (error) => {
              const errorMessage = error?.response?.data?.message || error?.message || 'Error al actualizar el producto';

              // Check for invalid/expired token
              if (errorMessage.includes('Token inválido o expirado')) {
                setIsTokenInvalid(true); // Show the modal
              } else {
                toast.error(errorMessage);
              }
            },
          }
        );
      } else {
        console.log("Creating product with payload:", { ...productoPayload, idTiposProducto: tiposProductoArray });
        createProduct(
          { 
            formData: { ...productoPayload, idTiposProducto: tiposProductoArray },
            token: undefined 
          }, 
          {
            onSuccess: (response) => {
              const data = response?.data || response;
              console.log("Product created successfully:", data);
              toast.success('Producto creado exitosamente');
              productForm.resetForm();
              router.push(`/admin/products/${data.id || data.idProducto}`);
            },
            onError: (error) => {
              const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el producto';

              // Check for invalid/expired token
              if (errorMessage.includes('Token inválido o expirado')) {
                setIsTokenInvalid(true); // Show the modal
              } else {
                toast.error(errorMessage);
              }
            },
          }
        );
      }

      return true;
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      toast.error('Error inesperado al guardar el producto');
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

  const handleModalClose = () => {
    setIsTokenInvalid(false);
    router.push('/login'); // Redirect to login page
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {idProducto ? 'Editar Producto' : 'Agregar Nuevo Producto'}
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

      {/* Modal for invalid/expired token */}
      {isTokenInvalid && (
        <Modal
          title="Sesión expirada"
          message="Tu sesión ha expirado o el token es inválido. Por favor, inicia sesión nuevamente."
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default withAuth(AddProductPage); // Wrap the component with the HOC