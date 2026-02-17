/**
 * Normaliza texto eliminando tildes y espacios.
 * @param {string} s - Texto a normalizar.
 * @returns {string} Texto limpio y en minúsculas.
 */
export const normalize = (s) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/**
 * Normaliza suavemente: minúsculas y espacios, preservando acentos.
 * Útil cuando el backend compara por nombre exacto en minúsculas.
 * @param {string} s
 * @returns {string}
 */
export const normalizeSoft = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .trim();

/**
 * Construye cadena de query a partir de un objeto de filtros.
 * @param {Record<string, any>} filters
 * @returns {string} Cadena de query
 */
export const buildFilterParams = (filters) => {
  const usp = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      if (Array.isArray(val)) val.forEach((v) => usp.append(key, String(v)));
      else usp.set(key, String(val));
    }
  });
  return usp.toString();
};

/**
 * Obtiene lista de nombres de tipos según categoría/subcategoría activas.
 * @param {Array} categoriesMenu
 * @param {string} c
 * @param {string} s
 * @returns {string[]} Lista de tipos únicos
 */
export const getTypeNames = (categoriesMenu, c, s) => {
  const cNorm = normalize(c);
  const sNorm = normalize(s);
  const activeCategory = (categoriesMenu || []).find(
    (cat) => normalize(cat.title) === cNorm
  );

  const cols = activeCategory?.columns || [];
  const col = s ? cols.find((x) => normalize(x.title) === sNorm) : undefined;

  if (col) {
    return (col.types || []).map((tp) => tp.name).filter(Boolean);
  }

  if (activeCategory) {
    return cols
      .flatMap((x) => x.types || [])
      .map((tp) => tp.name)
      .filter(Boolean);
  }

  const allTypes = (categoriesMenu || []).flatMap((group) =>
    (group.columns || []).flatMap((x) => x.types || [])
  );

  const set = new Set();
  for (const tp of allTypes) {
    const name = (tp?.name || "").trim();
    if (name) set.add(normalize(name));
  }

  return Array.from(set);
};

/**
 * Clasifica categoría/subcategoría/tipos a partir de texto y categoría existente.
 * @param {Object} payload
 * @param {string} [payload.name]
 * @param {string} [payload.description]
 * @param {string} [payload.category]
 * @returns {Object} { category, categoryLabel, subcategory, subcategoryLabel, types, confidence }
 */
export const classifyHierarchy = ({ name = "", description = "", category = "" } = {}) => {
  // IMPORTANTE: Esta función usa FILTERS_MAP desde constants; el consumidor debe proveerlo si necesita mapping enriquecido.
  // Para mantenerla pura, aquí solo hace una inferencia básica por normalización.
  const text = `${name} ${description}`.toLowerCase();
  const ntext = normalize(text);

  const directCat = normalize(category).replace(/\s+/g, "");
  const types = [];
  const confidence = directCat ? 0.5 : 0;

  return {
    category: directCat || undefined,
    categoryLabel: category || undefined,
    subcategory: undefined,
    subcategoryLabel: undefined,
    types,
    confidence,
  };
};

