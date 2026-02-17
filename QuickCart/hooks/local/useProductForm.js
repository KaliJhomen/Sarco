'use client';
import { useState, useMemo } from 'react';
import { validateProductForm } from '@/utils/helpers/productValidators';
import {calculateFinalPrice/*, calculateMonthlyPayment, calculateTotalStock */} from '@/utils/helpers/calculators';

export const useProductForm = () => {
  const initialFormData = {
    // Campos básicos del producto
    idTiposProducto:[],
    nombre: '',
    modelo: '',         
    descripcion: '',
    stock: 0,
    imagen: '',        
    precioTope: '',
    precioVenta: '',
    descuento: 0,
    fechaIngreso: new Date().toISOString().split('T')[0],     
    garantiaFabrica: '',
    colores: [{
      idColor:Date.now(),
      nombre: '',
      codigoHex: '#000000',
      stock: 0,
      imagenes: []
    }]
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcular valores derivados usando helpers
  const precioFinal = useMemo(() => 
    calculateFinalPrice(formData.precioVenta, formData.descuento),
    [formData.precioVenta, formData.descuento]
  );
/* Posible uso en Creditos
  const pagoMensual = useMemo(() => 
    calculateMonthlyPayment(formData.precio, formData.mesesSinInteres),
    [formData.precio, formData.mesesSinInteres]
  );
*/
/*
  const stockTotal = useMemo(() => 
    calculateTotalStock(formData.colores),
    [formData.colores]
  );
*/
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colores: [
        ...prev.colores,
        {
          id: Date.now(),
          nombreColor: '',
          codigoHex: '#000000',
          stock: 0,
          imagenes: []
        }
      ]
    }));
  };

  const removeColor = (colorId) => {
    if (formData.colores.length > 1) {
      setFormData(prev => ({
        ...prev,
        colores: prev.colores.filter(c => c.id !== colorId)
      }));
    }
  };

  const updateColor = (colorId, field, value) => {
    setFormData(prev => ({
      ...prev,
      colores: prev.colores.map(c =>
        c.id === colorId ? { ...c, [field]: value } : c
      )
    }));
  };

  const addColorImages = (colorId, newImages) => {
    setFormData(prev => ({
      ...prev,
      colores: prev.colores.map(c => {
        if (c.id === colorId) {
          const combinedImages = [...c.imagenes, ...newImages].slice(0, 4);
          return { ...c, imagenes: combinedImages };
        }
        return c;
      })
    }));
  };

  const removeColorImage = (colorId, imageIndex) => {
    setFormData(prev => ({
      ...prev,
      colores: prev.colores.map(c => {
        if (c.id === colorId) {
          return {
            ...c,
            imagenes: c.imagenes.filter((_, idx) => idx !== imageIndex)
          };
        }
        return c;
      })
    }));
  };

  const validate = () => {
    const validation = validateProductForm({
      nombre: formData.nombre,
      modelo: formData.modelo, 
      idMarca: formData.idMarca,
      precioTope: formData.precioTope,
      precioVenta: formData.precioVenta,
      descuento: formData.descuento,
      idCategoria: formData.idCategoria,
      idSubCategoria: formData.idSubCategoria,
      colores: formData.colores,
      imagen: formData.imagen, 
      fechaIngreso: formData.fechaIngreso, 
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = () => {
    setFormData({
      idTipoProducto:'',
      nombre: '',
      modelo: '',         
      descripcion: '',
      stock: 0,
      imagen: '',        
      precioTope: '',
      precioVenta: '',
      descuento: 0,
      fechaIngreso: new Date().toISOString().split('T')[0], 

      // Relaciones (IDs)
      idMarca: '',
      idCategoria: '',
      idSubCategoria: '',
      idTienda: '',      
      
      garantiaFabrica: '',
      colores: [{
        idColor:Date.now(),
        nombre: '',
        codigoHex: '#000000',
        stock: 0,
        imagenes: []
        }]
    });
    setErrors({});
  };

  const onSubmit = async (e, { onSuccess, onError }) => {
    e.preventDefault();
    console.log("onSubmit called with formData:", formData);

    // Validación básica
    const validationErrors = {};
    if (!formData.nombre) {
      validationErrors.nombre = "El nombre del producto es obligatorio.";
    }
    if (!formData.idCategoria) {
      validationErrors.idCategoria = "La categoría es obligatoria.";
    }
    if (!formData.idSubCategoria) {
      validationErrors.idSubCategoria = "La subcategoría es obligatoria.";
    }
    if (!formData.idTiposProducto || formData.idTiposProducto.length === 0) {
      validationErrors.idTiposProducto = "El tipo de producto es obligatorio.";
    }

    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation errors:", validationErrors);
      setErrors(validationErrors);
      onError && onError();
      return false;
    }

    try {
      setIsSubmitting(true);
      console.log("Sending data to API:", formData);

      // Llamada a la API para guardar el producto
      const response = await client.post('/productos', formData);
      console.log("API response:", response);

      if (response.status === 201) {
        console.log("Producto guardado exitosamente.");
        onSuccess && onSuccess();
        return true;
      } else {
        console.error("Error al guardar el producto:", response.data);
        onError && onError();
        return false;
      }
    } catch (error) {
      console.error("Error en la solicitud de guardado:", error);
      onError && onError();
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    onSubmit,
    isSubmitting,
    setIsSubmitting,
    updateField,
    addColor,
    removeColor,
    updateColor,
    addColorImages,
    removeColorImage,
    validate,
    resetForm,

    precioFinal,
    /*
    pagoMensual,
    
    stockTotal,
    */
    productoColor: formData.colores.map(color => ({
      idColor: color.idColor,
      stock: color.stock,
      imagen: color.imagenes?.[0] || "",
    }))
  };
};