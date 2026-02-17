/* Validaciones de Anuncios */

// Validaciones específicas de anuncios
const isUrl = (value) => {
  try {
    if (!value) return true;
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const validateAdForm = (formData) => {
  const errors = {};

  // Nombre requerido
  if (!formData.nombre?.trim()) {
    errors.nombre = 'El nombre es requerido';
  }

  if (!formData.titulo?.trim()) {
    errors.titulo = 'El título es requerido';
  }
  if (!formData.imagen?.trim()) {
    errors.imagen = 'La URL de la imagen es requerida';
  } else if (!isUrl(formData.imagen)) {
    errors.imagen = 'Ingresa una URL de imagen válida';
  }

  if (formData.urlDestino && !isUrl(formData.urlDestino)) {
    errors.urlDestino = 'Ingresa una URL de destino válida';
  }

  if (formData.orden !== undefined && formData.orden !== null) {
    const n = Number(formData.orden);
    if (Number.isNaN(n) || n < 0) {
      errors.orden = 'El orden debe ser un número mayor o igual a 0';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Seccion Basica Categoria

module.exports = {
  validateAdForm,
};