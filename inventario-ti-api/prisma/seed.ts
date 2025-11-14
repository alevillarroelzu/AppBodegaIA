import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...')

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...')
  await prisma.movement.deleteMany()
  await prisma.item.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.location.deleteMany()

  // Crear Ubicaciones
  console.log('📍 Creando ubicaciones...')
  const bodegaPrincipal = await prisma.location.create({
    data: { name: 'Bodega Principal' },
  })

  const oficinaIT = await prisma.location.create({
    data: { name: 'Oficina IT - Piso 3' },
  })

  const rack1 = await prisma.location.create({
    data: { name: 'Rack 1 - Servidor' },
  })

  const rack2 = await prisma.location.create({
    data: { name: 'Rack 2 - Networking' },
  })

  console.log(`✅ ${4} ubicaciones creadas`)

  // Crear Proveedores
  console.log('🏢 Creando proveedores...')
  const dell = await prisma.supplier.create({
    data: { name: 'Dell Technologies', email: 'ventas@dell.com' },
  })

  const hp = await prisma.supplier.create({
    data: { name: 'HP Inc.', email: 'contacto@hp.com' },
  })

  const cisco = await prisma.supplier.create({
    data: { name: 'Cisco Systems', email: 'info@cisco.com' },
  })

  const lenovo = await prisma.supplier.create({
    data: { name: 'Lenovo', email: 'ventas@lenovo.com' },
  })

  console.log(`✅ ${4} proveedores creados`)

  // Crear Ítems
  console.log('💻 Creando ítems de inventario...')

  const items = [
    // Servidores
    {
      code: 'SRV-001',
      name: 'Servidor Dell PowerEdge R740',
      stock: 3,
      minStock: 1,
      locationId: rack1.id,
      supplierId: dell.id,
    },
    {
      code: 'SRV-002',
      name: 'Servidor HP ProLiant DL380',
      stock: 2,
      minStock: 1,
      locationId: rack1.id,
      supplierId: hp.id,
    },

    // Laptops
    {
      code: 'LAP-001',
      name: 'Laptop Dell Latitude 7420',
      stock: 15,
      minStock: 5,
      locationId: bodegaPrincipal.id,
      supplierId: dell.id,
    },
    {
      code: 'LAP-002',
      name: 'Laptop HP EliteBook 840',
      stock: 12,
      minStock: 5,
      locationId: bodegaPrincipal.id,
      supplierId: hp.id,
    },
    {
      code: 'LAP-003',
      name: 'Laptop Lenovo ThinkPad X1',
      stock: 8,
      minStock: 3,
      locationId: bodegaPrincipal.id,
      supplierId: lenovo.id,
    },

    // Monitores
    {
      code: 'MON-001',
      name: 'Monitor Dell UltraSharp 27"',
      stock: 25,
      minStock: 10,
      locationId: bodegaPrincipal.id,
      supplierId: dell.id,
    },
    {
      code: 'MON-002',
      name: 'Monitor HP Z27',
      stock: 18,
      minStock: 8,
      locationId: bodegaPrincipal.id,
      supplierId: hp.id,
    },

    // Networking
    {
      code: 'SW-001',
      name: 'Switch Cisco Catalyst 2960',
      stock: 5,
      minStock: 2,
      locationId: rack2.id,
      supplierId: cisco.id,
    },
    {
      code: 'RTR-001',
      name: 'Router Cisco ISR 4331',
      stock: 2,
      minStock: 1,
      locationId: rack2.id,
      supplierId: cisco.id,
    },
    {
      code: 'FW-001',
      name: 'Firewall Cisco ASA 5516',
      stock: 1,
      minStock: 1,
      locationId: rack2.id,
      supplierId: cisco.id,
    },

    // Periféricos
    {
      code: 'KB-001',
      name: 'Teclado HP USB',
      stock: 40,
      minStock: 15,
      locationId: bodegaPrincipal.id,
      supplierId: hp.id,
    },
    {
      code: 'MS-001',
      name: 'Mouse Lenovo USB',
      stock: 45,
      minStock: 20,
      locationId: bodegaPrincipal.id,
      supplierId: lenovo.id,
    },

    // Storage
    {
      code: 'HDD-001',
      name: 'Disco Duro Externo 2TB',
      stock: 10,
      minStock: 5,
      locationId: bodegaPrincipal.id,
      supplierId: null, // Sin proveedor
    },
    {
      code: 'SSD-001',
      name: 'SSD Samsung 1TB',
      stock: 20,
      minStock: 8,
      locationId: bodegaPrincipal.id,
      supplierId: null,
    },

    // Bajo stock (para demostración)
    {
      code: 'CAB-001',
      name: 'Cable HDMI 2m',
      stock: 3,
      minStock: 10,
      locationId: oficinaIT.id,
      supplierId: null,
    },
    {
      code: 'CAB-002',
      name: 'Cable de Red CAT6 3m',
      stock: 8,
      minStock: 20,
      locationId: oficinaIT.id,
      supplierId: null,
    },
  ]

  const createdItems = []
  for (const itemData of items) {
    const item = await prisma.item.create({ data: itemData })
    createdItems.push(item)
  }

  console.log(`✅ ${createdItems.length} ítems creados`)

  // Crear Movimientos de ejemplo
  console.log('📦 Creando movimientos de inventario...')

  const movements = [
    // Ingresos
    {
      itemId: createdItems[0].id, // Servidor Dell
      type: 'IN' as const,
      quantity: 1,
      note: 'Compra inicial de servidores',
    },
    {
      itemId: createdItems[2].id, // Laptop Dell
      type: 'IN' as const,
      quantity: 10,
      note: 'Pedido para nuevos empleados',
    },

    // Salidas
    {
      itemId: createdItems[2].id, // Laptop Dell
      type: 'OUT' as const,
      quantity: 5,
      note: 'Asignación a equipo de desarrollo',
    },
    {
      itemId: createdItems[5].id, // Monitor Dell
      type: 'OUT' as const,
      quantity: 10,
      note: 'Instalación en oficinas',
    },

    // Ajustes
    {
      itemId: createdItems[14].id, // Cable HDMI
      type: 'ADJ' as const,
      quantity: -5,
      note: 'Ajuste por inventario físico - cables dañados',
    },
    {
      itemId: createdItems[10].id, // Teclado HP
      type: 'ADJ' as const,
      quantity: 5,
      note: 'Ajuste por inventario físico - unidades encontradas',
    },
  ]

  for (const movementData of movements) {
    await prisma.movement.create({ data: movementData })
  }

  console.log(`✅ ${movements.length} movimientos creados`)

  console.log('✨ Seeding completado exitosamente!')
  console.log('')
  console.log('📊 Resumen:')
  console.log(`   - Ubicaciones: 4`)
  console.log(`   - Proveedores: 4`)
  console.log(`   - Ítems: ${createdItems.length}`)
  console.log(`   - Movimientos: ${movements.length}`)
  console.log(`   - Ítems bajo stock mínimo: 2`)
}

main()
  .catch((e) => {
    console.error('❌ Error durante seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
