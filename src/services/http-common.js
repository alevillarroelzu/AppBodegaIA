import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8090/api',
  withCredentials: true, // Para enviar cookies (JWT)
})

api.interceptors.request.use((config) => {
  // Ejemplo: token si más adelante agregas auth
  // const token = localStorage.getItem('token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 401) {
      console.error('No autorizado. Por favor inicia sesión.')
    }
    return Promise.reject(error)
  }
)

export default api