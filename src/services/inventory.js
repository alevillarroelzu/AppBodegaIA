import api from './http-common'

export const InventoryService = {
  // ==================== ITEMS ====================
  async getItems(params = {}) {
    // params puede incluir: { page, limit, search }
    const { data } = await api.get('/items', { params })
    return data
  },
  async getItem(id) {
    const { data } = await api.get(`/items/${id}`)
    return data
  },
  async createItem(payload) {
    const { data } = await api.post('/items', payload)
    return data
  },
  async updateItem(id, payload) {
    const { data } = await api.put(`/items/${id}`, payload)
    return data
  },
  async deleteItem(id) {
    await api.delete(`/items/${id}`)
  },

  // ==================== LOCATIONS ====================
  async getLocations() {
    const { data } = await api.get('/locations')
    return data
  },
  async getLocation(id) {
    const { data } = await api.get(`/locations/${id}`)
    return data
  },
  async createLocation(payload) {
    const { data } = await api.post('/locations', payload)
    return data
  },
  async updateLocation(id, payload) {
    const { data } = await api.put(`/locations/${id}`, payload)
    return data
  },
  async deleteLocation(id) {
    await api.delete(`/locations/${id}`)
  },

  // ==================== SUPPLIERS ====================
  async getSuppliers() {
    const { data } = await api.get('/suppliers')
    return data
  },
  async getSupplier(id) {
    const { data } = await api.get(`/suppliers/${id}`)
    return data
  },
  async createSupplier(payload) {
    const { data } = await api.post('/suppliers', payload)
    return data
  },
  async updateSupplier(id, payload) {
    const { data } = await api.put(`/suppliers/${id}`, payload)
    return data
  },
  async deleteSupplier(id) {
    await api.delete(`/suppliers/${id}`)
  },

  // ==================== MOVEMENTS ====================
  async getMovements() {
    const { data } = await api.get('/movements')
    return data
  },
  async getMovement(id) {
    const { data } = await api.get(`/movements/${id}`)
    return data
  },
  async createMovement(payload) {
    const { data } = await api.post('/movements', payload)
    return data
  },
}