/* Validaciones específicas de productos*/

const validateCategoryForm = (formData) => {
  const errors = {};
/*
  SECCION Basica Categoria
*/
  // Nombre requerido
  if (!formData.nombre?.trim()) {
    errors.nombre = 'El nombre es requerido';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Seccion Basica Categoria


module.exports = {
  validateCategoryForm,
};