# Contexto del Proyecto Sarcos

Archivo de referencia para mantener contexto entre sesiones.
Última actualización: 2026-08-11

---

## 1. Arquitectura General

```
sarcos-main-nmdb/
├── backend/          # NestJS + TypeORM + MySQL
│   └── src/
│       ├── auth/           # JWT auth (login, register, guards)
│       ├── usuario/        # Clientes e-commerce (tabla: usuario)
│       ├── user/           # Admins/back-office (tabla: user, tiene campo rol)
│       ├── producto/       # Productos con filtros complejos
│       ├── favoritos/      # Favoritos (contenedor + items)
│       ├── carrito/        # Carrito (contenedor + items)
│       ├── pedido/         # Órdenes/checkout
│       └── ...             # 40+ módulos
└── QuickCart/        # Next.js frontend
    ├── components/   # React components
    ├── hooks/        # React Query hooks (server/) + local hooks
    ├── services/     # API services (axios)
    ├── context/      # React Context (AppContext, AuthContext, NotificationContext)
    └── app/          # Next.js app router pages
```

---

## 2. Base de Datos (Tablas principales)

### Relación Producto → Categoría (cadena completa)

```
Producto
  │ ManyToOne (tabla pivote)
  ▼
ProductoTipoProducto        ← tabla intermedia (M:N)
  │ ManyToOne
  ▼
TipoProducto
  │ OneToMany
  ▼
TipoProductoSubCategoria    ← tabla intermedia (M:N)
  │ ManyToOne
  ▼
SubCategoria
  │ ManyToOne
  ▼
Categoria
```

- Producto ↔ TipoProducto: **Muchos a Muchos** via `producto_tipo_producto`
- TipoProducto ↔ SubCategoria: **Muchos a Muchos** via `tipo_producto_sub_categoria`
- SubCategoria → Categoria: **Muchos a Uno** (FK directo)

### Dos sistemas de usuario (PARALELOS, sin conexión)

| Tabla | Entidad | Uso | Auth la usa | Tiene `rol` |
|-------|---------|-----|-------------|-------------|
| `usuario` | `Usuario` | Clientes e-commerce | ✅ Sí | ❌ No |
| `user` | `User` | Admins/back-office | ❌ No | ✅ Sí |

### Favoritos (diseño normalizado)

- `favoritos` = contenedor (1 fila por usuario/session)
- `favoritos_item` = items (cada fila = 1 producto en favoritos)
- FK en `favoritos_item`: `id_favoritos_item_favoritos` → `favoritos`, `id_favoritos_item_producto` → `producto`
- La tabla `favoritos` en el SQL dump viejo tiene `id_usuario` NOT NULL (problema para guest users)

---

## 3. Autenticación

### Flujo actual

```
1. POST /api/auth/register  → crea en tabla "usuario" (NO retorna token)
2. POST /api/auth/login     → retorna { token, usuario }
3. Usar token en: Authorization: Bearer <token> o cookie "token"
```

- JWT payload: `{ id: number, email: string }` (sin role)
- Expira: 30 minutos
- AuthGuard guarda en `request.usuario` (NO `request.user`)
- GuestGuard: permite pasar sin token, opcionalmente extrae payload

### Auth Dev Bypass (EN PRODUCCIÓN QUITAR)

En `auth.guard.ts:28-31`:
```typescript
if (process.env.NODE_ENV === 'development') {
  request.usuario = { id: 1, email: 'dev@localhost' };
  return true;
}
```

### RolesGuard (NO FUNCIONA)

- Lee `req.usuario.role` pero JWT no incluye `role`
- No está registrado como guard global
- Fix futuro: incluir role en JWT + registrar guard

---

## 4. Fixes Aplicados (esta sesión)

### Críticos

| Fix | Archivo | Detalle |
|-----|---------|---------|
| `req.user` → `req.usuario` | `pedido.controller.ts:28,49` | Pedido controller estaba roto |
| `handleFavorite` sin add duplicado | `ProductCard.jsx:52-78` | Línea 62 hacía add siempre |
| `favorites.service.js` ReferenceErrors | `favorites.service.js:31-34,55-65` | getSummary usaba `items` antes de declarar, update sin `quantity` |
| `cart.service.js` clear() | `cart.service.js:47` | Ahora acepta parámetro `ident` |
| `useFavorites` siempre ejecuta | `useFavorites.js:13` | Eliminado `enabled: !!payload` |
| ProductCard pasa payload | `ProductCard.jsx:37` | Pasa `sessionToken` para guest users |

### Medios

| Fix | Archivo | Detalle |
|-----|---------|---------|
| 28 `console.error` → Logger | 10 services + logger.ts | Todos los services del backend |
| Código comentado muerto | 7 archivos | controller, entity, dto, service |
| Casts `as Promise<>` redundantes | `carrito.service.ts`, `favoritos.service.ts` | Eliminados |
| 10 `console.log` con tokens | Frontend (AuthContext, session, cart, withAuth) | Seguridad |

### Anteriores (otra sesión)

| Fix | Archivo | Detalle |
|-----|---------|---------|
| `producto.service.ts` 13 fixes | `producto.service.ts` | Relations plural, create return, update transaction, etc. |
| 19 imports `src/` → relativos | 19 archivos backend | Credito, color, venta, producto.module, etc. |
| `favoritos.entity.ts` import | `favoritos.entity.ts:2` | `src/` → relativo |
| Frontend endpoints naming | `endpoints.js` | `byBrandId` → `byBrand`, etc. |
| `useProducts.js` queryFn | `useProducts.js:15` | `productService.getAll` → `productService.getAll()` |
| `ProductCard` idMarca2 | `ProductCard.jsx:29` | Eliminado `idMarca2` inexistente |
| `separado.entity.ts` transformer | `separado.entity.ts:65` | `tinyint` ↔ `boolean` |
| Spec files rotos | 12 archivos .spec.ts | Nombres de clases corregidos |

---

## 5. Problemas Conocidos (SIN FIX, ralentizan desarrollo)

### Backend - Seguridad

| # | Problema | Archivo | Fix futuro |
|---|----------|---------|------------|
| 1 | Auth bypass por `NODE_ENV` | `auth.guard.ts:28-31` | Usar flag `DEV_BYPASS_AUTH` |
| 2 | DB credentials hardcodeadas | `app.module.ts:64-74` | Migrar a ConfigModule |
| 3 | JWT secret fallback `'fallback'` | `jwt.constants.ts:2` | Throw en startup |
| 4 | Upload sin auth ni file type | `upload.controller.ts` | Agregar guard + fileFilter |
| 5 | 34+ endpoints sin auth (guards comentados) | 7 controllers | Uncomment en producción |
| 6 | Passwords sin hash en User | `user.service.ts:15-22` | Hash con bcryptjs |
| 7 | Cookie `secure: false` en dev | `auth.controller.ts:33-41` | Usar COOKIE_SECURE env var |
| 8 | CORS hardcodeado | `main.ts:44` | Usar CORS_ORIGIN env var |

### Backend - Arquitectura

| # | Problema | Detalle |
|---|----------|---------|
| 9 | Dos tablas de usuario paralelas | `usuario` (auth) vs `user` (admin) sin boundary |
| 10 | RolesGuard no funciona | JWT sin role, guard no registrado |
| 11 | IDOR en pedidos | `findOne` sin ownership check |
| 12 | `findAll()` sin paginación | Carga todos los productos con 6 JOINs |
| 13 | N+1 queries | pedido, carrito, favoritos services |
| 14 | God Module | `app.module.ts` con 53 imports |

### Frontend

| # | Problema | Detalle |
|---|----------|---------|
| 15 | Tokens en localStorage | Accesibles por XSS |
| 16 | Keys de token duplicadas | `"token"` vs `"auth-token"` |
| 17 | `.env` commiteado | `.gitignore` comentado |
| 18 | Sin CSRF protection | cookies + withCredentials sin token |
| 19 | Axios instances duplicados | Interceptores no se aplican |
| 20 | 88 console.log innecesarios | Debug noise |

---

## 6. Decisiones de Diseño Pendientes

| Decisión | Opciones | Estado |
|----------|----------|--------|
| ¿Qué tabla usa auth para roles? | A: Agregar `rol` a `usuario` / B: Migrar auth a `user` | Sin decidir |
| ¿Favoritos diseño? | Normalizado (contenedor+items) confirmado, DB tiene viejo diseño flat | Pendiente DB migration |
| ¿Carrito merge al loguear? | Lógica existe en `mergeGuestCart` pero no se llama desde auth | Pendiente integración |
| ¿Token storage frontend? | A: localStorage (actual, inseguro) / B: httpOnly cookies (requiere backend) | Pendiente migración |

---

## 7. Comandos Útiles

```bash
# Backend
cd backend
npm run start:dev          # Arrancar en dev (con auth bypass)
npx tsc --noEmit           # Type check
npm run build              # Build producción

# Frontend
cd QuickCart
npm run dev                # Arrancar Next.js en dev

# DB
npm run seed:db            # Seed (script no creado aún)
```

---

## 8. Configuración

### Backend `.env`
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=sarcos_db
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion
PORT=4000
NODE_ENV=development
```

### Frontend `.env`
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### tsconfig.json (backend)
- `baseUrl: "./"` → imports `src/...` funcionan pero deben ser relativos
- `strictNullChecks: true`

### Global prefix
- Todas las rutas backend: `/api/*`
- Swagger: `http://localhost:4000/api`

---

## 9. Patrones de Código

### Convenciones de nombres
- DB columns: `snake_case` (id_usuario, created_at)
- TypeScript: `camelCase` (idUsuario, createdAt)
- DTOs: `createXxxDto`, `updateXxxDto`
- Entities: singular (`Producto`, `Usuario`)
- Controllers: plural (`ProductoController`)
- `@CreateDateColumn`/`@UpdateDateColumn`: NO usar `nullable: true`
- Tokens: `length: 36` (UUID v4)

### Auth pattern
- Guest endpoints: `@UseGuards(GuestGuard)` — token opcional
- Auth endpoints: `@UseGuards(AuthGuard)` — token requerido
- `request.usuario = { id, email }` — SIEMPRE `usuario`, nunca `user`

### Response pattern
- `findAll()`: mapea relaciones a strings (ej: `marca: p.marca?.nombre`)
- `findOne()`: retorna entity completa con relaciones
- `remove()`: retorna `{ message: "..." }`
