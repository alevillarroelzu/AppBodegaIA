# AppBodegaIA - Sistema de Gestión de Inventario TI

Sistema completo de gestión de inventario para equipos de tecnología de información (TI) con arquitectura fullstack moderna.

## Características

- **Gestión de Ítems**: CRUD completo de productos/equipos con códigos únicos
- **Control de Stock**: Seguimiento en tiempo real con alertas de bajo stock
- **Movimientos**: Registro de entradas, salidas y ajustes de inventario
- **Ubicaciones**: Organización por ubicaciones físicas (bodegas, racks, etc.)
- **Proveedores**: Gestión de proveedores con información de contacto
- **Dashboard**: Métricas clave y visualización de datos
- **API RESTful**: Backend completo con Express y PostgreSQL

## Stack Tecnológico

### Frontend
- **React 19.1.1** - Framework UI
- **Vite 7.1** - Build tool de siguiente generación
- **TailwindCSS 4.1** - Framework CSS utility-first
- **React Router 7.9** - Navegación SPA
- **Axios** - Cliente HTTP

### Backend
- **Node.js + TypeScript** - Runtime y lenguaje tipado
- **Express 5.1** - Framework web
- **Prisma 6.18** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **Zod** - Validación de esquemas
- **JWT** - Autenticación (listo para habilitar)
- **AWS S3** - Almacenamiento en la nube

## Requisitos Previos

- **Node.js** 18+ y npm
- **PostgreSQL** 14+
- **Git**

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/AppBodegaIA.git
cd AppBodegaIA
```

### 2. Configurar Backend

```bash
cd inventario-ti-api

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

#### Configurar variables de entorno (.env)

```env
# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/inventario_ti

# Servidor
NODE_ENV=development
PORT=8090
CORS_ORIGIN=http://localhost:5173

# JWT (cambiar en producción)
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion

# AWS S3 (opcional)
APP_ACCESS_KEY_ID=tu_access_key_id
APP_SECRET_ACCESS_KEY=tu_secret_access_key
AWS_REGION=us-east-1
AWS_BUCKET=tu-bucket-name

# SMTP (opcional, para notificaciones)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-password-o-app-password
```

#### Crear base de datos y ejecutar migraciones

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para ver la base de datos
npm run prisma:studio
```

#### Iniciar servidor backend

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# O modo producción
npm run build
npm start
```

El backend estará disponible en `http://localhost:8090`

### 3. Configurar Frontend

En otra terminal:

```bash
cd AppBodegaIA

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# El archivo .env debe contener:
# VITE_API_BASE=http://localhost:8090/api
```

#### Iniciar servidor frontend

```bash
# Modo desarrollo
npm run dev

# O construir para producción
npm run build
npm run preview
```

El frontend estará disponible en `http://localhost:5173`

## Uso con Docker (Opcional)

Si prefieres usar Docker:

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## Estructura del Proyecto

```
AppBodegaIA/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── layout/              # Sidebar, Topbar
│   │   └── ui/                  # Button, Card, Modal, Table
│   ├── context/                 # InventoryContext con API
│   ├── hooks/                   # Hooks personalizados
│   ├── pages/                   # Páginas de la aplicación
│   ├── services/                # Servicios HTTP (Axios)
│   └── App.jsx
│
├── inventario-ti-api/           # Backend Express + TypeScript
│   ├── src/
│   │   ├── modules/
│   │   │   ├── items/          # CRUD de ítems
│   │   │   ├── locations/       # CRUD de ubicaciones
│   │   │   ├── suppliers/       # CRUD de proveedores
│   │   │   └── movements/       # Registro de movimientos
│   │   ├── middlewares/         # Auth, error handler
│   │   ├── config/              # Configuración de env
│   │   └── db/                  # Prisma client
│   └── prisma/
│       └── schema.prisma        # Esquema de base de datos
│
├── .env.example                 # Variables de entorno del frontend
├── docker-compose.yml           # Configuración Docker (opcional)
└── README.md                    # Este archivo
```

## API Endpoints

### Items
- `GET /api/items` - Listar todos los ítems
- `GET /api/items/:id` - Obtener un ítem
- `POST /api/items` - Crear ítem
- `PUT /api/items/:id` - Actualizar ítem
- `DELETE /api/items/:id` - Eliminar ítem

### Locations
- `GET /api/locations` - Listar ubicaciones
- `POST /api/locations` - Crear ubicación
- `PUT /api/locations/:id` - Actualizar ubicación
- `DELETE /api/locations/:id` - Eliminar ubicación

### Suppliers
- `GET /api/suppliers` - Listar proveedores
- `POST /api/suppliers` - Crear proveedor
- `PUT /api/suppliers/:id` - Actualizar proveedor
- `DELETE /api/suppliers/:id` - Eliminar proveedor

### Movements
- `GET /api/movements` - Listar movimientos
- `POST /api/movements` - Registrar movimiento (IN/OUT/ADJ)

### Health Check
- `GET /health` - Verificar estado del servidor

## Scripts Disponibles

### Frontend
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de build
npm run lint         # Ejecutar ESLint
```

### Backend
```bash
npm run dev                # Desarrollo con hot-reload
npm run build              # Compilar TypeScript
npm start                  # Iniciar en producción
npm run prisma:generate    # Generar cliente Prisma
npm run prisma:migrate     # Ejecutar migraciones
npm run prisma:studio      # Abrir Prisma Studio
```

## Modelo de Datos

### Item
- `id`: ID único (cuid)
- `code`: Código único del ítem
- `name`: Nombre descriptivo
- `stock`: Cantidad actual
- `minStock`: Stock mínimo (alerta)
- `locationId`: Ubicación (opcional)
- `supplierId`: Proveedor (opcional)

### Location
- `id`: ID único
- `name`: Nombre de la ubicación

### Supplier
- `id`: ID único
- `name`: Nombre del proveedor
- `email`: Email de contacto (opcional)

### Movement
- `id`: ID único
- `type`: Tipo (IN, OUT, ADJ)
- `itemId`: Referencia al ítem
- `quantity`: Cantidad
- `note`: Nota opcional
- `createdAt`: Fecha del movimiento

## Mejoras Futuras

- [ ] Sistema de autenticación y usuarios
- [ ] Roles y permisos
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Códigos QR/barras para ítems
- [ ] Notificaciones por email
- [ ] Historial de cambios (audit log)
- [ ] Paginación en tablas
- [ ] Búsqueda avanzada y filtros
- [ ] Modo oscuro
- [ ] Tests unitarios y de integración

## Problemas Comunes

### Error de conexión a la base de datos
Verifica que PostgreSQL esté corriendo y que `DATABASE_URL` sea correcta:
```bash
psql -U usuario -d inventario_ti
```

### Error de CORS
Asegúrate de que `CORS_ORIGIN` en el backend coincida con la URL del frontend.

### Puerto ya en uso
Si el puerto 8090 o 5173 está ocupado, cámbialos en `.env`:
```env
# Backend
PORT=3000

# Frontend (vite.config.js)
server: { port: 3001 }
```

## Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Soporte

Para reportar bugs o solicitar nuevas características, por favor abre un issue en el repositorio de GitHub.

---

Desarrollado con ❤️ para la gestión eficiente de inventarios TI
