import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useCatalogoStore } from './catalogo.js'
import { usePerfilStore } from './perfil.js'

const MAXIMO = 99
const clave = (correo) => `modo-shake-carrito:${correo}`

// El carrito guarda solo identificadores y cantidades; toma los precios del catálogo.
export const useCarritoStore = defineStore('carrito', () => {
  const perfil = usePerfilStore()
  const catalogo = useCatalogoStore()
  const items = ref([])
  const aviso = ref('')

  function recuperar(correo) {
    if (!correo) return []
    try {
      const datos = JSON.parse(localStorage.getItem(clave(correo)) || '[]')
      if (!Array.isArray(datos)) throw new Error('Carrito inválido')
      const ids = new Set()
      return datos.filter((item) => {
        if (!item || !Number.isInteger(item.id) || !Number.isInteger(item.cantidad) ||
          item.cantidad < 1 || item.cantidad > MAXIMO || ids.has(item.id)) return false
        ids.add(item.id)
        return true
      }).map((item) => ({ id: item.id, cantidad: item.cantidad }))
    } catch {
      aviso.value = 'No se pudo recuperar el carrito guardado.'
      return []
    }
  }

  watch(() => perfil.actual?.correo, (correo) => {
    items.value = recuperar(correo)
  }, { immediate: true, flush: 'sync' })

  function guardar() {
    if (!perfil.actual) return false
    try {
      localStorage.setItem(clave(perfil.actual.correo), JSON.stringify(items.value))
      return true
    } catch {
      aviso.value = 'No se pudo guardar el carrito en este navegador.'
      return false
    }
  }

  // Al actualizar el catálogo, se descartan productos que ya no existen.
  watch(() => catalogo.estado, (estado) => {
    if (estado !== 'listo' || !perfil.actual) return
    const validos = new Set(catalogo.productos.map((producto) => producto.id))
    const recuperados = items.value.filter((item) => validos.has(item.id))
    if (recuperados.length !== items.value.length) {
      items.value = recuperados
      guardar()
      aviso.value = 'Se recuperaron los productos válidos del carrito guardado.'
    }
  })

  const detalles = computed(() => items.value
    .map((item) => ({ ...item, producto: catalogo.obtenerPorId(item.id) }))
    .filter((item) => item.producto))
  const unidades = computed(() => detalles.value.reduce((suma, item) => suma + item.cantidad, 0))
  const total = computed(() => detalles.value.reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0))
  const estimado = computed(() => detalles.value.some((item) => item.producto.precioDesde))

  function agregar(id) {
    if (!perfil.actual) return false
    const producto = catalogo.obtenerPorId(id)
    if (!producto) return false
    const item = items.value.find((actual) => actual.id === id)
    if (item && item.cantidad >= MAXIMO) {
      aviso.value = `Puedes agregar hasta ${MAXIMO} unidades de cada producto.`
      return false
    }
    if (item) item.cantidad += 1
    else items.value.push({ id, cantidad: 1 })
    guardar()
    aviso.value = `${producto.nombre} agregado al carrito.`
    return true
  }

  function cambiarCantidad(id, cantidad) {
    const valor = Number(cantidad)
    if (!Number.isInteger(valor) || valor < 1 || valor > MAXIMO) {
      aviso.value = `Escribe una cantidad entera entre 1 y ${MAXIMO}.`
      return false
    }
    const item = items.value.find((actual) => actual.id === id)
    if (!item) return false
    item.cantidad = valor
    guardar()
    aviso.value = 'Cantidad actualizada.'
    return true
  }

  function quitar(id) {
    items.value = items.value.filter((item) => item.id !== id)
    guardar()
    aviso.value = 'Producto eliminado del carrito.'
  }

  function vaciar() {
    items.value = []
    guardar()
    aviso.value = 'Carrito vaciado.'
  }

  return { items, detalles, unidades, total, estimado, aviso, agregar, cambiarCantidad, quitar, vaciar }
})
