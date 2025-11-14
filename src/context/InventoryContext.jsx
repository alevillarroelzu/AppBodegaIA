import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { InventoryService } from '../services/inventory'

const InventoryContext = createContext(null)

const initialState = {
  items: [],
  locations: [],
  suppliers: [],
  movements: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    case 'SET_LOCATIONS':
      return { ...state, locations: action.payload }
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload }
    case 'SET_MOVEMENTS':
      return { ...state, movements: action.payload }
    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items] }
    case 'UPDATE_ITEM': {
      const items = state.items.map((it) => (it.id === action.payload.id ? { ...it, ...action.payload } : it))
      return { ...state, items }
    }
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter((it) => it.id !== action.payload) }
    case 'ADD_LOCATION':
      return { ...state, locations: [action.payload, ...state.locations] }
    case 'UPDATE_LOCATION': {
      const locations = state.locations.map((loc) => (loc.id === action.payload.id ? { ...loc, ...action.payload } : loc))
      return { ...state, locations }
    }
    case 'DELETE_LOCATION':
      return { ...state, locations: state.locations.filter((loc) => loc.id !== action.payload) }
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [action.payload, ...state.suppliers] }
    case 'UPDATE_SUPPLIER': {
      const suppliers = state.suppliers.map((sup) => (sup.id === action.payload.id ? { ...sup, ...action.payload } : sup))
      return { ...state, suppliers }
    }
    case 'DELETE_SUPPLIER':
      return { ...state, suppliers: state.suppliers.filter((sup) => sup.id !== action.payload) }
    case 'REGISTER_MOVEMENT':
      return { ...state, movements: [action.payload, ...state.movements] }
    default:
      return state
  }
}

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos iniciales desde la API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const [itemsResponse, locations, suppliers, movementsResponse] = await Promise.all([
          InventoryService.getItems(),
          InventoryService.getLocations(),
          InventoryService.getSuppliers(),
          InventoryService.getMovements(),
        ])

        // Si la respuesta incluye paginación, extraer solo los datos
        const items = itemsResponse.data || itemsResponse
        const movements = movementsResponse.data || movementsResponse

        dispatch({ type: 'SET_ITEMS', payload: items })
        dispatch({ type: 'SET_LOCATIONS', payload: locations })
        dispatch({ type: 'SET_SUPPLIERS', payload: suppliers })
        dispatch({ type: 'SET_MOVEMENTS', payload: movements })
      } catch (err) {
        console.error('Error cargando datos:', err)
        setError(err.message || 'Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Métodos para sincronizar con el backend
  const actions = useMemo(() => ({
    // Items
    async addItem(payload) {
      const created = await InventoryService.createItem(payload)
      dispatch({ type: 'ADD_ITEM', payload: created })
      return created
    },
    async updateItem(id, payload) {
      const updated = await InventoryService.updateItem(id, payload)
      dispatch({ type: 'UPDATE_ITEM', payload: updated })
      return updated
    },
    async deleteItem(id) {
      await InventoryService.deleteItem(id)
      dispatch({ type: 'DELETE_ITEM', payload: id })
    },

    // Locations
    async addLocation(payload) {
      const created = await InventoryService.createLocation(payload)
      dispatch({ type: 'ADD_LOCATION', payload: created })
      return created
    },
    async updateLocation(id, payload) {
      const updated = await InventoryService.updateLocation(id, payload)
      dispatch({ type: 'UPDATE_LOCATION', payload: updated })
      return updated
    },
    async deleteLocation(id) {
      await InventoryService.deleteLocation(id)
      dispatch({ type: 'DELETE_LOCATION', payload: id })
    },

    // Suppliers
    async addSupplier(payload) {
      const created = await InventoryService.createSupplier(payload)
      dispatch({ type: 'ADD_SUPPLIER', payload: created })
      return created
    },
    async updateSupplier(id, payload) {
      const updated = await InventoryService.updateSupplier(id, payload)
      dispatch({ type: 'UPDATE_SUPPLIER', payload: updated })
      return updated
    },
    async deleteSupplier(id) {
      await InventoryService.deleteSupplier(id)
      dispatch({ type: 'DELETE_SUPPLIER', payload: id })
    },

    // Movements
    async registerMovement(payload) {
      const created = await InventoryService.createMovement(payload)
      dispatch({ type: 'REGISTER_MOVEMENT', payload: created })
      // Recargar items para actualizar el stock
      const itemsResponse = await InventoryService.getItems()
      const items = itemsResponse.data || itemsResponse
      dispatch({ type: 'SET_ITEMS', payload: items })
      return created
    },
  }), [])

  const value = useMemo(() => ({
    state,
    dispatch,
    actions,
    loading,
    error
  }), [state, actions, loading, error])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory debe usarse dentro de InventoryProvider')
  return ctx
}