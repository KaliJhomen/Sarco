const endpoints = {
  // ============================================
  // AUTENTICACIÓN
  // ============================================
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/profile', 
    refresh: '/auth/refresh', 
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },
  
  // ============================================
  // CLIENTES
  // ============================================

  clients: {
    base: '/cliente',
    all: '/cliente',
    byId: (id) => `/cliente/${id}`,
    update: (id) => `/cliente/${id}`, // PATCH
    delete: (id) => `/cliente/${id}`, // DELETE
    search: (q) => `/cliente?q=${encodeURIComponent(q)}`,
    filter: '/cliente/filter',
  },

  // ============================================
  // USUARIOS
  // ============================================
  users: {
    base: `/usuario`,
    getAll: `/usuario`, // GET: Obtener todos los usuarios
    getById: (id) => `/usuario/${id}`, // GET: Obtener un usuario por ID
    create: `/usuario`, // POST: Crear un nuevo usuario
    update: (id) => `/usuario/${id}`, // PATCH: Actualizar un usuario por ID
    delete: (id) => `/usuario/${id}`, // DELETE: Eliminar un usuario por ID
  },
  // ============================================
  // PRODUCTOS
  // ============================================
  products: {
    base: '/producto',
    all: '/producto',
    byId: (id) => `/producto/${id}`,
    search: (query) => `/producto/filtro?busqueda?=${encodeURIComponent(query)}`,
    byBrand: (idMarca) => `/producto/filtro?idMarca=${idMarca}`,
    byBrands: (marcas) => `/producto/filtro?marcas=${marcas.join(',')}`,
    byCategory: (idCategoria) => `/producto/filtro?idCategoria=${idCategoria}`,
    bySubCategory: (idSubCategoria) => `/producto/filtro?idSubCategoria=${idSubCategoria}`,
    byProductType: (idTipoProducto) => `/producto/filtro?idTipoProducto=${idTipoProducto}`,
    byStore: (tienda_id) => `/producto/filtro?idTienda=${tienda_id}`,
    byStores: (tiendas) => `/producto/filtro?idTienda=${tiendas.join(',')}`,
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
///
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
  // ANUNCIOS
  // ============================================
  anuncios: {
    base: '/anuncio',
    all: '/anuncio',
    activos: '/anuncio/activos',
    byId: (id) => `/anuncio/${id}`,
  },

  // ============================================
  // CARRITO
  // ============================================
  cart: {
    base: '/carrito',
    get: '/carrito',
    add: '/carrito',
    update: (idProducto) => `/carrito/${idProducto}`,
    remove: (idProducto) => `/carrito/${idProducto}`,
    genToken: '/carrito/share',
    getShared: (shareToken) => `/carrito/shared/${shareToken}`,
    // clear: '/carrito/limpiar',
    // summary: '/carrito/resumen',
  }, 
  // ============================================
  // FAVORITOS
  // ============================================
  favorites: {
    base: '/favoritos',
    get: '/favoritos', // GET: Obtener todos los favoritos del usuario autenticado
    add: `/favoritos`, // POST: Agregar producto a favoritos (body: { idProducto })
    remove: (idProducto) => `/favoritos/${idProducto}`, // DELETE: Quitar producto de favoritos
    genToken: '/favoritos/share',
    getShared: (shareToken) => `/favoritos/shared/${shareToken}`,
  },
  
  // ============================================
  // ÓRDENES/PEDIDOS
  // ============================================
  orders: {
    base: '/pedido',
    all: '/pedido',
    byId: (id) => `/pedido/${id}`,
    byUser: (userId) => `/pedido/usuario/${userId}`,
    create: '/pedido',
    update: (id) => `/pedido/${id}`,
    cancel: (id) => `/pedido/${id}/cancelar`,
  },
  orderDetails: {
    byOrderId: (pedidoId) => `/pedido/${pedidoId}/detalles`,
    byId: (detalleId) => `/pedido-detalle/${detalleId}`,
    update: (detalleId) => `/pedido-detalle/${detalleId}`,
    delete: (detalleId) => `/pedido-detalle/${detalleId}`,
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
    sales: '/analytics/user-ventas',
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