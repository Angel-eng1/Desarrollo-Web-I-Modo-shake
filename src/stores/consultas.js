import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

const CLAVE_BORRADOR = 'modo-shake-borrador'
const CLAVE_CONSULTAS = 'modo-shake-consultas'
const vacio = () => ({
  nombre: '', correo: '', telefono: '', fecha: '', personas: '', motivo: '', mensaje: '',
})

function leer(clave, inicial) {
  try {
    const dato = JSON.parse(localStorage.getItem(clave))
    return dato === null ? inicial : dato
  } catch {
    return inicial
  }
}

// El store comparte el borrador y las consultas locales; no envía información a un servidor.
export const useConsultasStore = defineStore('consultas', () => {
  const guardado = leer(CLAVE_BORRADOR, {})
  const borrador = reactive({
    ...vacio(),
    ...Object.fromEntries(Object.entries(guardado && typeof guardado === 'object' && !Array.isArray(guardado) ? guardado : {})
      .filter(([clave, valor]) => clave in vacio() && (typeof valor === 'string' || (clave === 'personas' && typeof valor === 'number')))
      .map(([clave, valor]) => [clave, String(valor)])),
  })
  const datos = leer(CLAVE_CONSULTAS, [])
  const consultas = ref(Array.isArray(datos)
    ? datos.filter((item) => item && typeof item.id === 'string' && typeof item.nombre === 'string')
    : [])
  const aviso = ref('')

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
      return true
    } catch {
      aviso.value = 'Este navegador no permitió guardar los datos.'
      return false
    }
  }

  function guardarBorrador() {
    guardar(CLAVE_BORRADOR, Object.fromEntries(
      Object.entries(borrador).map(([clave, valor]) => [clave, String(valor)])
    ))
  }

  function guardarConsulta() {
    const consulta = { id: crypto.randomUUID(), ...Object.fromEntries(
      Object.entries(borrador).map(([clave, valor]) => [clave, String(valor).trim()])
    ) }
    const nuevas = [consulta, ...consultas.value]
    if (!guardar(CLAVE_CONSULTAS, nuevas)) return false
    consultas.value = nuevas
    Object.assign(borrador, vacio())
    try {
      localStorage.removeItem(CLAVE_BORRADOR)
    } catch {
      aviso.value = 'Consulta guardada, pero no se pudo borrar el borrador.'
      return true
    }
    aviso.value = 'Consulta guardada en este navegador. No fue enviada al restaurante.'
    return true
  }

  function eliminar(id) {
    const nuevas = consultas.value.filter((item) => item.id !== id)
    if (!guardar(CLAVE_CONSULTAS, nuevas)) return false
    consultas.value = nuevas
    aviso.value = 'Consulta eliminada de este navegador.'
    return true
  }

  return { borrador, consultas, aviso, guardarBorrador, guardarConsulta, eliminar }
})
