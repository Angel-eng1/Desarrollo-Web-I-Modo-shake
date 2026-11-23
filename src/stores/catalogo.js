import { defineStore } from 'pinia'

// Este store comparte los productos y el estado de carga entre las vistas.
export const useCatalogoStore = defineStore('catalogo', {
  state: () => ({
    productos: [],
    estado: 'sin-cargar',
    error: '',
  }),
  getters: {
    categorias: (state) => [...new Set(state.productos.map((producto) => producto.categoria))],
    obtenerPorId: (state) => (id) => state.productos.find((producto) => producto.id === Number(id)),
  },
  actions: {
    async cargar(force = false) {
      if (this.estado === 'cargando' || (!force && this.estado === 'listo')) return
      this.estado = 'cargando'
      this.error = ''
      try {
        const respuesta = await fetch(`${import.meta.env.BASE_URL}data.json`)
        if (!respuesta.ok) {
          if (respuesta.status === 404) throw new Error('No se encontró el catálogo (404).')
          if (respuesta.status >= 500) throw new Error('El servidor no pudo cargar el catálogo. Intenta más tarde.')
          throw new Error(`No se pudo cargar el catálogo (HTTP ${respuesta.status}).`)
        }
        const datos = await respuesta.json()
        const campos = ['nombre', 'descripcion', 'categoria', 'imagen', 'alt']
        const valido = Array.isArray(datos) && datos.every((producto) =>
          producto && Number.isInteger(producto.id) &&
          campos.every((campo) => typeof producto[campo] === 'string' && producto[campo].trim()) &&
          Number.isFinite(producto.precio) && producto.precio >= 0 &&
          typeof producto.precioDesde === 'boolean'
        ) && new Set(datos.map((producto) => producto.id)).size === datos.length
        if (!valido) throw new Error('Los datos del catálogo no tienen el formato esperado.')
        this.productos = datos
        this.estado = 'listo'
      } catch (error) {
        this.productos = []
        this.estado = 'error'
        this.error = error instanceof TypeError
          ? 'No se pudo conectar para cargar el catálogo. Revisa tu conexión y vuelve a intentar.'
          : error instanceof SyntaxError
            ? 'No se pudieron leer los datos del catálogo.'
            : error.message
      }
    },
  },
})
