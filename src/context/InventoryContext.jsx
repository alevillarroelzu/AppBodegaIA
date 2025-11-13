import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const InventoryContext = createContext(null)

const initialState = {
  items: [],
  locations: [
    { id: 'LOC-01', name: 'Bodega Central' },
    { id: 'LOC-02', name: 'Rack Servidores' },
  ],
  suppliers: [
    { id: 'SUP-01', name: 'Proveedor A', email: 'ventas@proveedora.cl' },
  ],
  movements: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload }
    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items] }
    case 'UPDATE_ITEM': {
      const items = state.items.map((it) => (it.id === action.payload.id ? { ...it, ...action.payload } : it))
      return { ...state, items }
    }
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter((it) => it.id !== action.payload) }
    case 'REGISTER_MOVEMENT': {
      const mv = action.payload
      const items = state.items.map((it) =>
        it.id === mv.itemId
          ? { ...it, stock: it.stock + (mv.type === 'IN' ? mv.quantity : mv.type === 'OUT' ? -mv.quantity : mv.quantity) }
          : it,
      )
      return { ...state, items, movements: [mv, ...state.movements] }
    }
    case 'ADD_LOCATION':
      return { ...state, locations: [action.payload, ...state.locations] }
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [action.payload, ...state.suppliers] }
    default:
      return state
  }
}

export function InventoryProvider({ children }) {
  const [saved, setSaved] = useLocalStorage('inv-ti', null)
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (saved) dispatch({ type: 'LOAD_FROM_STORAGE', payload: saved })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSaved(state)
  }, [state, setSaved])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory debe usarse dentro de InventoryProvider')
  return ctx
}