import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createPinia, setActivePinia } from 'pinia'
import { useCatalogoStore } from '../src/stores/catalogo.js'
import { usePerfilStore } from '../src/stores/perfil.js'
import { useCarritoStore } from '../src/stores/carrito.js'
import { useConsultasStore } from '../src/stores/consultas.js'

function prepararNavegador() {
  const memoria = new Map()
  globalThis.localStorage = {
    getItem: (clave) => memoria.get(clave) ?? null,
    setItem: (clave, valor) => memoria.set(clave, valor),
    removeItem: (clave) => memoria.delete(clave),
  }
  setActivePinia(createPinia())
  return memoria
}

const productos = JSON.parse(readFileSync(new URL('../public/data.json', import.meta.url), 'utf8'))

test('el carrito pertenece al perfil y se recupera tras reiniciar los stores', () => {
  prepararNavegador()
  let catalogo = useCatalogoStore()
  let perfil = usePerfilStore()
  let carrito = useCarritoStore()
  catalogo.productos = productos

  assert.equal(perfil.registrar('Ana Prueba', 'ana@ejemplo.com'), true)
  assert.equal(carrito.agregar(1), true)
  assert.equal(carrito.cambiarCantidad(1, 2), true)
  assert.equal(carrito.total, 30000)
  assert.equal(carrito.cambiarCantidad(1, 100), false)
  assert.equal(carrito.unidades, 2)

  assert.equal(perfil.cerrar(), true)
  assert.equal(carrito.unidades, 0)
  assert.equal(perfil.registrar('Luis Prueba', 'luis@ejemplo.com'), true)
  assert.equal(carrito.unidades, 0)
  assert.equal(carrito.agregar(2), true)
  assert.equal(perfil.cerrar(), true)

  setActivePinia(createPinia())
  catalogo = useCatalogoStore()
  perfil = usePerfilStore()
  carrito = useCarritoStore()
  catalogo.productos = productos
  assert.equal(perfil.entrar('ana@ejemplo.com'), true)
  assert.equal(carrito.unidades, 2)
  assert.equal(carrito.total, 30000)
})

test('el borrador y las consultas sobreviven al reinicio y se pueden eliminar', () => {
  const memoria = prepararNavegador()
  let consultas = useConsultasStore()
  Object.assign(consultas.borrador, {
    nombre: 'Ana Prueba', correo: 'ana@ejemplo.com', telefono: '3001234567',
    fecha: '2026-11-25', personas: 2, motivo: 'menu', mensaje: '',
  })
  consultas.guardarBorrador()

  setActivePinia(createPinia())
  consultas = useConsultasStore()
  assert.equal(consultas.borrador.personas, '2')
  assert.equal(consultas.guardarConsulta(), true)
  assert.equal(memoria.has('modo-shake-borrador'), false)

  setActivePinia(createPinia())
  consultas = useConsultasStore()
  assert.equal(consultas.consultas.length, 1)
  assert.equal(consultas.consultas[0].personas, '2')
  assert.equal(consultas.eliminar(consultas.consultas[0].id), true)
  assert.equal(consultas.consultas.length, 0)
})

test('el catálogo distingue errores HTTP, datos inválidos y reintenta la carga', async (t) => {
  prepararNavegador()
  const catalogo = useCatalogoStore()
  let respuesta = new Response('', { status: 404 })
  const peticion = t.mock.method(globalThis, 'fetch', async () => respuesta)

  await catalogo.cargar()
  assert.equal(catalogo.estado, 'error')
  assert.match(catalogo.error, /404/)
  respuesta = new Response('', { status: 500 })
  await catalogo.cargar(true)
  assert.equal(catalogo.estado, 'error')
  assert.match(catalogo.error, /servidor/)

  respuesta = new Response(JSON.stringify([{ id: 1 }]), { status: 200 })
  await catalogo.cargar(true)
  assert.equal(catalogo.estado, 'error')
  assert.match(catalogo.error, /formato esperado/)

  respuesta = new Response(JSON.stringify(productos), { status: 200 })
  await catalogo.cargar(true)
  assert.equal(catalogo.estado, 'listo')
  assert.equal(catalogo.productos.length, 7)
  assert.equal(catalogo.obtenerPorId(1)?.nombre, 'Batido de fresa')
  assert.equal(peticion.mock.callCount(), 4)
})
