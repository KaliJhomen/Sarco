import client from './api/client';
import endpoints from './api/endpoints';
import { colorService } from './color.service';

export const productService = {
  async getAll(token) {
    const response = await client.get(endpoints.products.all, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || response;
  },

  async getById(id, token) {
    const response = await client.get(endpoints.products.byId(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || response;
  },

  async search(query, token) {
    return client.get(endpoints.products.search(query), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async getByBrand(idMarca, token) {
    return client.get(endpoints.products.byBrand(idMarca), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getByBrands(marcas, token) {
    return client.get(endpoints.products.byBrands(marcas), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getByCategory(idCategoria, token) {
    return client.get(endpoints.products.byCategory(idCategoria), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  async getBySubCategory(idSubCategoria, token) {
    return client.get(endpoints.products.bySubCategory(idSubCategoria), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getByProductType(idTipoProducto, token) {
    return client.get(endpoints.products.byProductType(idTipoProducto), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getByStore(tienda_id, token) {
    return client.get(endpoints.products.byStore(tienda_id), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getByStores(tiendas, token) {
    return client.get(endpoints.products.byStores(tiendas), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  async create(formData, token) {
    const payload = {
      //Campos Tabla Producto
      nombre: formData.nombre?.trim() || "",
      modelo: formData?.modelo?.trim() || "",
      idMarca: parseInt(formData.idMarca),

      descripcion: formData?.descripcion?.trim() || "",
      stock: parseInt(formData?.stock) || 0,
      imagen: formData?.imagen?.trim() || "",
      precioTope: parseFloat(formData.precioTope),
      precioVenta: parseFloat(formData.precioVenta), 
      fechaIngreso: formData.fechaIngreso || "",      
      garantiaFabrica: parseInt(formData?.garantiaFabrica) || null,
      descuento: parseFloat(formData?.descuento) || 0,
      idTiposProducto: Array.isArray(formData.idTiposProducto)
        ? formData.idTiposProducto.map(Number)
        : [Number(formData.idTiposProducto)],
/*
      //Campos Relaciondos
      idCategoria: parseInt(formData?.idCategoria),
      idSubCategoria: parseInt(formData?.idSubCategoria),
      idTienda: parseInt(formData?.idTienda),
/*
      productoColor: formData?.colores.map(color => ({
        idColor: color.idColor, 
        stock: color.stock,
        imagen: color.imagenes?.[0] || "",
        nombre: color.nombre?.trim() || "",
        codigoHex: color.codigoHex || "#000000",
      }))
      */
      /*
      estado: formData?.estado !== undefined ? formData?.estado : 1,
      mesesCredito: parseInt(formData?.mesesCredito) || 0,
      */
    };

    const response = await client.post(endpoints.products.base, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async update(id, data, token) {
    const payload = {
      nombre: data.nombre?.trim(),
      modelo: data.modelo?.trim(),
      descripcion: data.descripcion?.trim(),
      stock: data.stock ? parseInt(data.stock) : undefined,
      imagen: data.imagen?.trim(),
      precioTope: data.precioTope ? parseFloat(data.precioTope) : undefined,
      precioVenta: data.precioVenta ? parseFloat(data.precioVenta) : undefined,
      descuento: data.descuento !== undefined ? parseFloat(data.descuento) : undefined,
      fechaIngreso: data.fechaIngreso,
  /*
      idMarca: data.idMarca ? parseInt(data.idMarca) : undefined,
      idCategoria: data.idCategoria ? parseInt(data.idCategoria) : undefined,
      idSubCategoria: data.idSubCategoria ? parseInt(data.idSubCategoria) : undefined,
      idTienda: data.idTienda ? parseInt(data.idTienda) : undefined,
*/
      garantiaFabrica: data.garantiaFabrica ? parseInt(data.garantiaFabrica) || null : null,
      idTiposProducto:[],
/*
      productoColor: data.colores ? data.colores.map(color => ({
        idColor: color.idColor,
        nombre: color.nombre?.trim() || "",
        codigoHex: color.codigoHex || "#000000",
        })) : undefined,
/*
      estado: data.estado !== undefined ? data.estado : undefined,
      mesesCredito: data.mesesCredito ? parseInt(data.mesesCredito) : undefined,
*/
      };

    return client.put(endpoints.products.byId(id), payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async delete(id, token) {
    return client.delete(endpoints.products.byId(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Obtiene productos filtrados con parámetros complejos
   * @param {Object} filters - Objeto con filtros
   * @param {string[]} filters.c - Array de nombres de categorías normalizados
   * @param {string[]} filters.s - Array de nombres de subcategorías normalizados
   * @param {string[]} filters.t - Array de nombres de tipos normalizados
   * @param {number[]} filters.marca_id - Array de IDs de marcas
   * @param {number} filters.price_min - Precio mínimo
   * @param {number} filters.price_max - Precio máximo
   */
  async getFiltered(filters = {}, token) {
    const params = new URLSearchParams();
    
    // Agregar arrays de filtros
    if (Array.isArray(filters.c) && filters.c.length > 0) {
      filters.c.forEach(cat => params.append('c[]', cat));
    }
    
    if (Array.isArray(filters.s) && filters.s.length > 0) {
      filters.s.forEach(subcat => params.append('s[]', subcat));
    }
    
    if (Array.isArray(filters.t) && filters.t.length > 0) {
      filters.t.forEach(type => params.append('t[]', type));
    }
    
    if (Array.isArray(filters.marca_id) && filters.marca_id.length > 0) {
      filters.marca_id.forEach(id => params.append('marca_id[]', id));
    }
    
    // Agregar rango de precios
    if (filters.price_min !== undefined) {
      params.set('price_min', filters.price_min);
    }
    
    if (filters.price_max !== undefined) {
      params.set('price_max', filters.price_max);
    }
    
    // Búsqueda
    if (filters.busqueda) {
      params.set('busqueda', filters.busqueda);
    }
    
    // Agregar filtro de descuento
    if (filters.hasDiscount === true) {
      params.set('hasDiscount', 'true'); 
    }
    const url = params.toString() 
      ? `${endpoints.products.base}/filtro?${params.toString()}`
      : `${endpoints.products.base}/filtro`;
    
    const response = await client.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || response;
  }
};
