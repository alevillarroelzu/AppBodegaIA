# Changelog - AppBodegaIA

Todos los cambios notables del proyecto serán documentados en este archivo.

## [1.2.0] - 2025-01-14

### 🎉 Nuevas Funcionalidades

#### Backend
- **Paginación en Movimientos**: Soporte completo de paginación con `page`, `limit`, `total`, `totalPages` y `hasMore`
- **Filtros Avanzados**: Filtrado por tipo (`IN`, `OUT`, `ADJ`), ítem y rango de fechas en movimientos
- **Documentación Swagger**: Interfaz interactiva completa en `/api-docs`
  - Especificación OpenAPI 3.0
  - Prueba de endpoints directamente desde el navegador
  - Esquemas de datos documentados
  - Ejemplos de request/response

#### Frontend
- **Exportación a CSV**: Exportación de datos a archivos CSV
  - Items con ubicación y proveedor
  - Movimientos con detalles de ítem
  - Ubicaciones y proveedores
  - Nombres de columnas en español
  - Fechas formateadas
- **Componentes UI Mejorados**:
  - `ConfirmDialog`: Modal de confirmación elegante (reemplaza `alert()`)
  - `EmptyState`: Estados vacíos con iconos y llamadas a la acción
  - `LoadingSkeleton`: Skeletons de carga para tablas, cards y listas

### 🔧 Mejoras

- Context actualizado para manejar respuestas paginadas
- Tipos de movimientos traducidos (`IN` → `Ingreso`, etc.)
- Mejor manejo de relaciones en respuestas del backend

### 📚 Documentación

- Swagger UI disponible en `http://localhost:8090/api-docs`
- JSON spec disponible en `http://localhost:8090/api-docs.json`
- Anotaciones completas en rutas de Items

### 🐛 Correcciones

- Extracción correcta de datos paginados en el frontend
- Manejo de respuestas con y sin paginación

---

## [1.1.0] - 2025-01-14

### ✅ Mejoras de Producción

#### Críticas
- **Punto de entrada corregido**: `server.ts` → `index.ts`
- **Schema de Movements**: Extraído a archivo separado para consistencia
- **Middleware 404**: Manejo adecuado de rutas no encontradas
- **Logging estructurado**: Winston con logs rotativos y niveles

#### Seguridad
- **Helmet.js**: Protección contra XSS, clickjacking y vulnerabilidades comunes
- **Rate Limiting**:
  - General: 100 requests/15min
  - Escrituras: 50 requests/15min
  - Health check: 30 requests/min
- **Límite de payload**: Máximo 10MB por request
- **CORS configurado**: Origin específico

#### Performance
- **Compresión HTTP**: Reducción ~70% en tamaño de payload
- **Graceful Shutdown**: Deploy sin downtime
- **Manejo de errores**: `unhandledRejection`, `uncaughtException`

#### Base de Datos
- **Seeders**: Datos de ejemplo realistas
  - 4 ubicaciones
  - 4 proveedores (Dell, HP, Cisco, Lenovo)
  - 16 ítems (servidores, laptops, networking)
  - 6 movimientos de ejemplo

#### Monitoreo
- **Health Check Mejorado**:
  - Verificación de conexión a BD
  - Uptime del sistema
  - Environment actual
- **Logging Completo**:
  - Archivos rotativos (error.log, combined.log)
  - HTTP request logging con Morgan
  - Logs JSON en producción, coloridos en desarrollo

### 📦 Nuevas Dependencias

**Producción:**
- winston ^3.17.0
- morgan ^1.10.0
- helmet ^8.0.0
- compression ^1.7.4
- express-rate-limit ^7.5.0
- ts-node ^10.9.2

**Desarrollo:**
- @types/morgan ^1.9.9
- @types/compression ^1.7.5

### 📁 Archivos Nuevos

- `src/config/logger.ts` - Configuración de Winston
- `src/middlewares/requestLogger.ts` - Morgan + Winston
- `src/middlewares/rateLimiter.ts` - Rate limiting configurado
- `src/modules/movements/schema.ts` - Schema de validación
- `prisma/seed.ts` - Seeders de datos
- `PRODUCTION_READY.md` - Guía completa de producción

### 🚀 Comandos Nuevos

```bash
# Ejecutar seeders
npm run prisma:seed

# Ver logs en tiempo real
tail -f logs/combined.log

# Verificar health check
curl http://localhost:8090/health
```

---

## [1.0.0] - 2025-01-13

### 🎉 Lanzamiento Inicial

#### Características Principales

**Backend:**
- API RESTful completa con Express + TypeScript
- Base de datos PostgreSQL con Prisma ORM
- Módulos: Items, Locations, Suppliers, Movements
- Validación con Zod en backend y frontend
- Transacciones atómicas para movimientos de stock
- Integridad referencial con validaciones

**Frontend:**
- React 19 con Vite 7
- TailwindCSS 4 para estilos
- Context API para estado global
- React Router para navegación
- Toast notifications
- CRUD completo para todas las entidades

**Dashboard:**
- 3 KPIs principales
- 3 gráficos interactivos con Recharts:
  - Stock por ubicación
  - Estado de stock
  - Tendencia de movimientos
- Últimos movimientos

**Seguridad:**
- JWT preparado (comentado)
- CORS configurado
- Validación de datos en todos los niveles

### 📊 Tecnologías

**Frontend:**
- React 19.1.1
- Vite 7.1
- TailwindCSS 4.1
- Recharts 2.15
- React Hook Form 7.54
- Zod 3.24

**Backend:**
- Node.js + TypeScript 5.9
- Express 5.1
- Prisma 6.18
- PostgreSQL
- Zod 4.1

---

## Formato

Este changelog sigue [Keep a Changelog](https://keepachangelog.com/es/1.0.0/)
y el proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

### Tipos de cambios:
- `Added` para nuevas funcionalidades
- `Changed` para cambios en funcionalidades existentes
- `Deprecated` para funcionalidades que serán removidas
- `Removed` para funcionalidades removidas
- `Fixed` para correcciones de bugs
- `Security` para vulnerabilidades corregidas
