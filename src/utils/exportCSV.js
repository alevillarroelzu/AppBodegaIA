/**
 * Exporta un array de objetos a un archivo CSV
 * @param {Array} data - Array de objetos a exportar
 * @param {string} filename - Nombre del archivo (sin extensión)
 * @param {Object} columns - Mapeo de columnas { key: 'header' }
 */
export function exportToCSV(data, filename, columns = null) {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar')
    return
  }

  // Si no se especifican columnas, usar todas las keys del primer objeto
  const cols = columns || Object.keys(data[0]).reduce((acc, key) => {
    acc[key] = key
    return acc
  }, {})

  // Crear el header del CSV
  const headers = Object.values(cols)
  const csvHeader = headers.map(h => `"${h}"`).join(',')

  // Crear las filas del CSV
  const csvRows = data.map(row => {
    return Object.keys(cols).map(key => {
      let value = row[key]

      // Manejar valores null/undefined
      if (value === null || value === undefined) {
        return '""'
      }

      // Manejar objetos anidados
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }

      // Manejar fechas
      if (value instanceof Date) {
        value = value.toLocaleString()
      }

      // Escapar comillas y envolver en comillas
      value = String(value).replace(/"/g, '""')
      return `"${value}"`
    }).join(',')
  })

  // Combinar header y filas
  const csv = [csvHeader, ...csvRows].join('\n')

  // Crear blob y descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Exporta ítems a CSV con formato personalizado
 */
export function exportItemsToCSV(items) {
  const columns = {
    code: 'Código',
    name: 'Nombre',
    stock: 'Stock',
    minStock: 'Stock Mínimo',
    locationName: 'Ubicación',
    supplierName: 'Proveedor',
  }

  // Transformar datos para incluir nombres de ubicación y proveedor
  const transformedData = items.map(item => ({
    code: item.code,
    name: item.name,
    stock: item.stock,
    minStock: item.minStock,
    locationName: item.location?.name || 'Sin ubicación',
    supplierName: item.supplier?.name || 'Sin proveedor',
  }))

  exportToCSV(transformedData, 'inventario_items', columns)
}

/**
 * Exporta movimientos a CSV con formato personalizado
 */
export function exportMovementsToCSV(movements) {
  const typeLabels = {
    IN: 'Ingreso',
    OUT: 'Salida',
    ADJ: 'Ajuste',
  }

  const columns = {
    type: 'Tipo',
    itemCode: 'Código Ítem',
    itemName: 'Nombre Ítem',
    quantity: 'Cantidad',
    note: 'Nota',
    date: 'Fecha',
  }

  // Transformar datos
  const transformedData = movements.map(m => ({
    type: typeLabels[m.type] || m.type,
    itemCode: m.item?.code || m.itemId,
    itemName: m.item?.name || '',
    quantity: m.quantity,
    note: m.note || '',
    date: new Date(m.createdAt || m.date).toLocaleString(),
  }))

  exportToCSV(transformedData, 'inventario_movimientos', columns)
}

/**
 * Exporta ubicaciones a CSV
 */
export function exportLocationsToCSV(locations) {
  const columns = {
    name: 'Nombre',
    createdAt: 'Fecha de Creación',
  }

  const transformedData = locations.map(l => ({
    name: l.name,
    createdAt: new Date(l.createdAt).toLocaleString(),
  }))

  exportToCSV(transformedData, 'inventario_ubicaciones', columns)
}

/**
 * Exporta proveedores a CSV
 */
export function exportSuppliersToCSV(suppliers) {
  const columns = {
    name: 'Nombre',
    email: 'Email',
    createdAt: 'Fecha de Creación',
  }

  const transformedData = suppliers.map(s => ({
    name: s.name,
    email: s.email || 'Sin email',
    createdAt: new Date(s.createdAt).toLocaleString(),
  }))

  exportToCSV(transformedData, 'inventario_proveedores', columns)
}
