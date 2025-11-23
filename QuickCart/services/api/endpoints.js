/*Endpoints centralizados de la API
 */

import { productTypeProductService } from "../productTypeProduct.service";

const endpoints = {
  // ============================================
  // PRODUCTOS
  // ============================================
  products: {
    base: '/producto',
    all: '/producto',
    byId: (id) => `/producto/${id}`,
    search: (query) => `/producto/filtro?busqueda?=${encodeURIComponent(query)}`,
    byBrandId: (idMarca) => `/producto/filtro?idMarca=${idMarca}`,
    byBrands: (marcas) => `/producto/filtro?marcas=${marcas.join(',')}`,
    byCategoryId: (idCategoria) => `/producto/filtro/categoria/${idCategoria}`,
    bySubCategoryId: (idSubCategoria) => `/producto/filtro/filtro?idSubCategoria=${idSubCategoria}`,
    byProductTypeId: (idTipoProducto) => `/producto/filtro?tipoProducto=${idTipoProducto}`,
    byStoreId: (tienda_id) => `/producto/filtro?tienda=${tienda_id}`,
    byStores: (tiendas) => `/producto/filtro?tiendas=${tiendas.join(',')}`,
    /*
    inStock: '/producto/stock',
    featured: '/producto/destacados',
    newArrivals: '/producto/nuevos',
    onSale: '/producto/ofertas',
    byPriceRange: (min, max) => `/producto/precio?min=${min}&max=${max}`,
    */
    },
///
/// Tipo Productos 
////
  productTypes: {
    base: '/tipo-producto',
    all: '/tipo-producto',
    byId: (id) => `/tipo-producto/${id}`,
    bySubCategoryId: (idSubCategoria) => `/tipo-producto/filtro?idSubCategoria=${idSubCategoria}`,
    byProductId: (idProducto) => `/tipo-producto/filtro?idProducto=${idProducto}`,

  },

// Producto Tipo Producto
///
  productTypeProducts:{
    base:'/producto-tipo-producto',
    all:'/producto-tipo-producto',
    byProductId:(id) => `/producto-tipo-producto/by-product=${id}`,
  },
  // ============================================
  // MARCAS
  // ============================================
  brands: {
    base: '/marca',
    all: '/marca',
    byId: (id) => `/marca/${id}`,

  },

  // ============================================
  // CATEGORÍAS
  // ============================================
  categories: {
    base: '/categoria',
    all: '/categoria',
    byId: (id) => `/categoria/${id}`,

    },
// ============================================
// SUB CATEGORIAS
//  
  subCategories:{
    base:'/sub-categoria',
    all:'/sub-categoria',
    byId:(id) => `/sub-categoria/${id}`,
    byCategoryId: (id) => `/sub-categoria?categoria_id=${id}`,
    
  },
  // ============================================
  // COLORES
  // ============================================
  colors: {
    base: '/color',
    all: '/color',
    byId: (id) => `/color/${id}`,

  },

  // ============================================
  // IMÁGENES
  // ============================================
  images: {
    upload: '/upload',
    uploadMultiple: '/upload/multiple',
    delete: (filename) => `/upload/${filename}`,
    byProduct: (productId) => `/imagen/producto/${productId}`,
  },
  
  // ============================================
  // CARRITO
  // ============================================
  /*cart: {
    base: '/carrito',
    get: '/carrito',
    add: '/carrito/agregar',
    update: (itemId) => `/carrito/item/${itemId}`,
    remove: (itemId) => `/carrito/item/${itemId}`,
    clear: '/carrito/limpiar',
    count: '/carrito/count',
  },
  */
  // ============================================
  // ÓRDENES/PEDIDOS
  // ============================================
  /*
  orders: {
    base: '/orden',
    all: '/orden',
    byId: (id) => `/orden/${id}`,
    create: '/orden/crear',
    update: (id) => `/orden/${id}`,
    cancel: (id) => `/orden/${id}/cancelar`,
    byUser: (userId) => `/orden/usuario/${userId}`,
    byStatus: (status) => `/orden/estado/${status}`,
  },
  */
  // ============================================
  // AUTENTICACIÓN
  // ============================================
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },

  // ============================================
  // USUARIOS
  // ============================================
  users: {
    base: '/usuario',
    all: '/usuario',
    byId: (id) => `/usuario/${id}`,
    /*
    profile: '/usuario/perfil',
    updateProfile: '/usuario/perfil',
    changePassword: '/usuario/cambiar-password',
    addresses: '/usuario/direcciones',
    addAddress: '/usuario/direcciones',
    updateAddress: (addressId) => `/usuario/direcciones/${addressId}`,
    deleteAddress: (addressId) => `/usuario/direcciones/${addressId}`,
    */
    },

  // ============================================
  // VENDEDORES 
  // ============================================
  sellers: {
    base: '/vendedor',
    all: '/vendedor',
    byId: (id) => `/vendedor/${id}`,
    products: (sellerId) => `/vendedor/${sellerId}/productos`,
    orders: (sellerId) => `/vendedor/${sellerId}/ordenes`,
    stats: (sellerId) => `/vendedor/${sellerId}/estadisticas`,
  },
  //============================================ 
  // Tiendas
  //============================================
  stores: {
    all: '/tienda',
    byId: (id) => `/tienda/${id}`,
    /*
    byName: (name) => `/tienda/nombre/${encodeURIComponent(name)}`,
    byAddress: (address) => `/tienda/direccion/${encodeURIComponent(address)}`,
    byCondition: (condition) => `/tienda/condicion/${encodeURIComponent(condition)}`,
    */
    },
    
  // ============================================
  // WISHLIST/FAVORITOS
  // ============================================
  /*wishlist: {
    base: '/favoritos',
    all: '/favoritos',
    add: '/favoritos/agregar',
    remove: (productId) => `/favoritos/${productId}`,
    check: (productId) => `/favoritos/check/${productId}`,
  },
  */
  // ============================================
  // CUPONES/DESCUENTOS
  // ============================================
  /*
  coupons: {
    base: '/cupon',
    validate: (code) => `/cupon/validar/${code}`,
    apply: '/cupon/aplicar',
  },*/

  // ============================================
  // PAGOS
  // ============================================
  payments: {
    base: '/pago',
    methods: '/pago/metodos',
    process: '/pago/procesar',
    verify: (paymentId) => `/pago/verificar/${paymentId}`,
  },

  // ============================================
  // ENVÍOS
  // ============================================
  shipping: {
    base: '/envio',
    calculate: '/envio/calcular',
    methods: '/envio/metodos',
    track: (trackingId) => `/envio/rastrear/${trackingId}`,
  },

  // ============================================
  // ESTADÍSTICAS/ANALYTICS 
  // ============================================
  analytics: {
    dashboard: '/analytics/dashboard',
    sales: '/analytics/ventas',
    products: '/analytics/productos',
    customers: '/analytics/clientes',
  },

  // ============================================
  // NOTIFICACIONES
  // ============================================
  notifications: {
    base: '/notificacion',
    all: '/notificacion',
    unread: '/notificacion/no-leidas',
    markAsRead: (id) => `/notificacion/${id}/leida`,
    markAllAsRead: '/notificacion/marcar-todas-leidas',
  },

  // ============================================
  // CONFIGURACIÓN
  // ============================================
  settings: {
    general: '/configuracion/general',
    store: '/configuracion/tienda',
    email: '/configuracion/email',
    social: '/configuracion/redes-sociales',
  },
};

export default endpoints;