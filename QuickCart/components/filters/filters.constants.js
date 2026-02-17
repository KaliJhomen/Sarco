export const FILTER_PARAM_KEYS = {
  category: "c",
  subcategory: "s",
  type: "t",
  priceMin: "price_min",
  priceMax: "price_max",
};

export const PARAM_LABELS = {
  c: "Categoría",
  s: "Subcategoría",
  t: "Tipo",
  price_min: "Precio mínimo",
  price_max: "Precio máximo",
  brand: "Marca",
  search: "Búsqueda",
};

export const PATHS = {
  allProducts: "/shop/products",
};

export const FILTERS_MAP = {
  categories: {
    tecnologia: {
      label: "Tecnología",
      subcategories: {
        televisores: { label: "Televisores", keywords: ["Smart Tv", "QLED", "Accesorios de Tv", "Raks"] },
        computacion: { label: "Computación", keywords: ["Laptops", "Computadoras de escritorio", "Monitores", "Proyectores", "Impresoras", "Tintas", "Toners", "Estabilizadores"] },
        gaming: { label: "Gaming", keywords: ["Monitores gamer", "Laptops gamer", "Audífonos gamer", "Mouse gamer", "Mousepad", "Teclados gamer", "Coolers", "Sillas gamer", "PC gamer", "Accesorios gamer"] },
        celulares: { label: "Celulares", keywords: ["Celulares", "Cargadores", "Cables", "Baterías externas", "Fundas", "Accesorios de celulares"] },
        audifonos: { label: "Audífonos", keywords: ["Alámbricos", "Inalámbricos"] },
        audio: { label: "Audio", keywords: ["Equipos de sonido", "Parlantes", "Amplificadores", "Parlantes Bluetooth", "Torres de sonido", "Buzzers", "Instrumentos musicales", "Autoradios", "Radios", "Radios portátiles"] },
        video: { label: "Video", keywords: [] },
        "smart-home-domotica": { label: "Smart Home y domótica", keywords: ["Asistente inteligente", "Asistente de voz", "Interruptores", "Cámaras de seguridad"] },
        iluminacion: { label: "Iluminación", keywords: ["Paneles solares", "Controlador de carga", "Estabilizadores"] },
        accesorios: { label: "Accesorios", keywords: ["Conectores", "Extensiones", "Supresores", "Estabilizadores", "Tintas", "Toners", "Baterías", "Cargadores", "Cables", "Cabezales", "Baterías externas", "Pilas", "Fundas", "Accesorios de celulares"] },
      },
    },
    lineablanca: {
      label: "Línea Blanca",
      subcategories: {
        lavado: { label: "Lavado", keywords: ["Lavadoras"] },
        refrigeracion: { label: "Refrigeración", keywords: ["Refrigeradoras", "Frigobar", "Mini refrigeradores"] },
        cocina: { label: "Cocina", keywords: ["Cocinas", "Cocinas de alta precisión", "Cocinas de pie", "Cocinas de mesa", "Cocinas empotrables", "Cocina de vidrio templado", "Quemadores", "Cocinas eléctricas"] },
        climatizacion: { label: "Climatización", keywords: ["Aire acondicionado", "Ventiladores"] },
        electrodomesticos: { label: "Electrodomésticos", keywords: ["Licuadoras", "Freidoras de aire", "Batidoras", "Arroceras", "Cafeteras", "Extractores", "Planchas", "Horno microondas"] },
      },
    },
    hogar: {
      label: "Hogar",
      subcategories: {
        iluminacion: { label: "Iluminación", keywords: ["Focos", "Lámparas", "Foco LED"] },
        decoracion: { label: "Decoración", keywords: ["Relojes", "Sofás", "Mesas de centro"] },
        organizacion: { label: "Organización", keywords: ["Organizadores", "Esquinero", "Tocadores", "Zapateros", "Roperos", "Veladores", "Porta TV"] },
        seguridad: { label: "Seguridad", keywords: ["Cámaras de seguridad"] },
        "smart-home-domotica": { label: "Smart Home y domótica", keywords: ["Asistente inteligente", "Asistente de voz", "Interruptores", "Cámaras de seguridad"] },
        "articulos-cocina": { label: "Artículos de cocina", keywords: ["Juegos de ollas", "Ollas", "Sartenes", "Teteras"] },
        "articulos-jardin": { label: "Artículos de jardín", keywords: ["Artículos de jardín", "Gras"] },
      },
    },
    dormitorio: {
      label: "Dormitorio",
      subcategories: {
        "articulos-dormitorio": { label: "Artículos de dormitorio", keywords: ["Almohadas"] },
        colchones: { label: "Colchones", keywords: ["2.5 plazas", "2 plazas", "1.5 plazas"] },
        tarimas: { label: "Tarimas", keywords: ["2.5 plazas", "2 plazas", "1.5 plazas"] },
        "box-tarima": { label: "Box Tarima", keywords: ["2.5 plazas", "2 plazas", "1.5 plazas"] },
        "muebles-dormitorio": { label: "Muebles de dormitorio", keywords: ["Cabeceras", "Roperos", "Veladores", "Cómodas", "Tocadores", "Zapateros"] },
      },
    },
    muebles: {
      label: "Muebles",
      subcategories: {
        sala: { label: "Sala", keywords: ["Juegos de sala", "Sofás", "Comedores", "Mueble de TV", "Sillón", "Estanterías", "Porta TV"] },
        comedor: { label: "Comedor", keywords: ["Juegos de comedor", "Comedor", "Sillas"] },
        decoracion: { label: "Decoración", keywords: ["Estanterías", "Cómodas", "Veladores", "Tocadores"] },
        "muebles-dormitorio": { label: "Muebles de dormitorio", keywords: ["Colchones", "Tarimas", "Box tarima", "Cabeceras", "Roperos", "Veladores", "Cómodas", "Tocadores", "Zapateros"] },
        "muebles-oficina": { label: "Muebles de oficina", keywords: ["Sillas", "Escritorios", "Estanterías", "Esquinero", "Sofá"] },
      },
    },
    oficina: {
      label: "Oficina",
      subcategories: {
        "articulos-oficina": { label: "Artículos de oficina", keywords: ["Impresoras", "Tinta para impresora", "Monitores", "Proyectores"] },
        "muebles-oficina": { label: "Muebles de oficina", keywords: ["Sillas", "Escritorios", "Estanterías", "Esquinero", "Sofá"] },
      },
    },
    "cuidado-personal": {
      label: "Cuidado Personal",
      subcategories: {
        belleza: { label: "Belleza", keywords: ["Secadoras de cabello", "Planchas de cabello", "Afeitadoras"] },
      },
    },
    entretenimiento: {
      label: "Entretenimiento",
      subcategories: {
        juegos: { label: "Juegos", keywords: ["Juegos"] },
        videojuegos: { label: "Videojuegos", keywords: ["Videojuegos"] },
        "consolas-videojuegos": { label: "Consolas de videojuegos", keywords: ["Consolas de videojuegos"] },
        mandos: { label: "Mandos", keywords: ["Mandos"] },
        "accesorios-videojuegos": { label: "Accesorios de videojuegos", keywords: ["Accesorios de videojuegos"] },
      },
    },
    motos: {
      label: "Motos",
      subcategories: {
        "motos-lineales": { label: "Motos lineales", keywords: ["Motos lineales"] },
        "motos-electricas": { label: "Motos eléctricas", keywords: ["Bicimotos", "Motos eléctricas"] },
        trimotos: { label: "Trimotos", keywords: ["Trimotos"] },
        cargueros: { label: "Cargueros", keywords: ["Cargueros"] },
      },
    },
  },
};