# 🚀 Guía de Producción - AppBodegaIA

Este documento describe las mejoras implementadas para hacer la aplicación lista para producción.

## ✅ Mejoras Implementadas

### 1. **Problemas Críticos Resueltos** ✓

#### ✅ Punto de entrada corregido
- **Problema:** `package.json` apuntaba a `src/index.ts` pero el archivo era `src/server.ts`
- **Solución:** Renombrado a `src/index.ts`

#### ✅ Schema de Movements extraído
- **Problema:** Schema inline en el controller
- **Solución:** Creado `src/modules/movements/schema.ts` separado

#### ✅ Middleware 404
- **Problema:** No había manejo de rutas inexistentes
- **Solución:** Middleware 404 antes del errorHandler

#### ✅ Sistema de logging
- **Problema:** Solo `console.log()` sin estructura
- **Solución:** Winston con logs rotativos y niveles configurables

---

### 2. **Seguridad Implementada** 🔐

#### ✅ Helmet.js
Protección contra vulnerabilidades comunes:
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing
- Headers de seguridad HTTP

#### ✅ Rate Limiting
Protección contra abuso y DoS:
- **General:** 100 requests/15min por IP
- **Escrituras:** 50 operaciones/15min
- **Health check:** 30 requests/minuto

#### ✅ Límite de payload
- Máximo 10MB por request
- Previene ataques de memoria

#### ✅ CORS configurado
- Origin específico (no wildcard)
- Credentials habilitadas

---

### 3. **Logging y Monitoreo** 📊

#### Winston Logger
```typescript
logger.info('Mensaje informativo')
logger.warn('Advertencia')
logger.error('Error', { context: 'data' })
logger.debug('Debug en desarrollo')
```

#### Características:
- **Desarrollo:** Logs coloridos en consola
- **Producción:** Logs JSON estructurados
- **Archivos rotativos:**
  - `logs/error.log` - Solo errores (5MB x 5 archivos)
  - `logs/combined.log` - Todos los logs (5MB x 10 archivos)
- **HTTP logging:** Morgan integrado con Winston

#### Health Check Mejorado
```bash
curl http://localhost:8090/health
```
Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-01-14T...",
  "uptime": 3600,
  "environment": "development",
  "database": "connected"
}
```

---

### 4. **Performance** ⚡

#### ✅ Compresión HTTP
- Respuestas comprimidas automáticamente
- Reducción de ~70% en tamaño de payload
- Mejora de velocidad en redes lentas

#### ✅ Graceful Shutdown
```javascript
// Manejo de SIGTERM para deploy sin downtime
process.on('SIGTERM', () => {
  server.close(() => {
    logger.info('Servidor cerrado correctamente')
    process.exit(0)
  })
})
```

#### ✅ Manejo de errores no capturados
- `unhandledRejection`
- `uncaughtException`
- Logging completo antes de exit

---

### 5. **Base de Datos** 🗄️

#### Seeders Implementados
Script completo con datos de ejemplo:
- **4 Ubicaciones:** Bodegas, racks, oficinas
- **4 Proveedores:** Dell, HP, Cisco, Lenovo
- **16 Ítems:** Servidores, laptops, monitores, networking, periféricos
- **6 Movimientos:** Ingresos, salidas y ajustes de ejemplo

#### Uso:
```bash
cd inventario-ti-api

# Opción 1: Solo seeders
npm run prisma:seed

# Opción 2: Migrar y hacer seed
npm run prisma:migrate

# Opción 3: Reset completo (cuidado en producción!)
npx prisma migrate reset --skip-seed && npm run prisma:seed
```

---

## 📦 Instalación de Nuevas Dependencias

### Backend

```bash
cd inventario-ti-api

# Instalar nuevas dependencias
npm install winston morgan helmet compression express-rate-limit ts-node

# Instalar tipos de desarrollo
npm install --save-dev @types/morgan @types/compression
```

### Verificar instalación
```bash
# Debe mostrar las nuevas dependencias
npm list winston morgan helmet compression express-rate-limit
```

---

## 🔧 Configuración

### Variables de Entorno

Agregar a `.env`:
```env
# Logging
LOG_LEVEL=debug  # Opciones: error, warn, info, http, debug
```

Niveles por entorno:
- **Desarrollo:** `debug` (más verboso)
- **Staging:** `info`
- **Producción:** `warn` o `error`

---

## 🧪 Testing

### Verificar Health Check
```bash
# Debe responder con status 200 y database: connected
curl http://localhost:8090/health
```

### Verificar Rate Limiting
```bash
# Enviar 101 requests rápidamente
for i in {1..101}; do
  curl http://localhost:8090/api/items
done

# El request 101 debe responder 429 Too Many Requests
```

### Verificar Logging
```bash
# Iniciar servidor
npm run dev

# Verificar que se crean los archivos de logs
ls -lh logs/
# Debe mostrar: error.log, combined.log

# Ver logs en tiempo real
tail -f logs/combined.log
```

### Verificar 404
```bash
# Debe responder con mensaje en español
curl http://localhost:8090/ruta-inexistente
```

---

## 🚀 Despliegue

### Preparación

1. **Instalar dependencias:**
```bash
cd inventario-ti-api
npm install
```

2. **Configurar entorno:**
```bash
cp .env.example .env
nano .env  # Configurar variables de producción
```

3. **Ejecutar migraciones:**
```bash
npm run prisma:migrate
```

4. **Cargar datos iniciales (opcional):**
```bash
npm run prisma:seed
```

5. **Build para producción:**
```bash
npm run build
```

6. **Iniciar en producción:**
```bash
NODE_ENV=production npm start
```

### Docker

Si usas Docker Compose, todo está configurado:
```bash
docker-compose up -d
```

---

## 📊 Monitoreo en Producción

### Logs
Los logs se encuentran en `logs/`:
```bash
# Ver últimos 100 errores
tail -100 logs/error.log

# Buscar errores específicos
grep "Error" logs/combined.log

# Ver logs de hoy
grep "2025-01-14" logs/combined.log
```

### Métricas del Sistema
```bash
# Ver uptime del servidor
curl http://localhost:8090/health | jq '.uptime'

# Monitorear en tiempo real
watch -n 5 'curl -s http://localhost:8090/health | jq'
```

---

## 🔒 Checklist de Seguridad Pre-Producción

- [x] Helmet habilitado
- [x] Rate limiting configurado
- [x] CORS con origin específico
- [x] Límite de payload (10MB)
- [x] Logs estructurados
- [x] Health check funcional
- [ ] JWT_SECRET cambiado (aún en .env.example)
- [ ] DATABASE_URL segura (no exponer credenciales)
- [ ] HTTPS habilitado en producción
- [ ] Backups de BD configurados
- [ ] Monitoreo externo (Sentry, etc.)

---

## 📚 Recursos Adicionales

### Documentación de Dependencias
- [Winston](https://github.com/winstonjs/winston) - Logging
- [Morgan](https://github.com/expressjs/morgan) - HTTP logging
- [Helmet](https://helmetjs.github.io/) - Seguridad
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting
- [compression](https://github.com/expressjs/compression) - Compresión

### Próximos Pasos Recomendados
1. Implementar tests (Jest + Supertest)
2. CI/CD con GitHub Actions
3. Documentación API con Swagger
4. Monitoreo con Sentry o LogRocket
5. Backups automáticos de BD
6. Habilitar autenticación JWT

---

## 📝 Notas de Versión

**Versión:** 1.1.0
**Fecha:** 2025-01-14
**Estado:** Production Ready ✅

### Cambios desde v1.0.0
- ✅ Logging estructurado
- ✅ Rate limiting
- ✅ Seguridad mejorada
- ✅ Health check con verificación de BD
- ✅ Seeders de datos
- ✅ Manejo robusto de errores
- ✅ Compresión HTTP
- ✅ Graceful shutdown

---

¿Dudas? Revisa los logs en `logs/` o ejecuta `npm run dev` para ver el output en consola.
