<script setup>
import { computed, onMounted } from 'vue'
import { useCatalogoStore } from '../stores/catalogo'
import { useCarritoStore } from '../stores/carrito'
import { usePerfilStore } from '../stores/perfil'
import { CONFIG_NEGOCIO } from '../config/negocio'
import EstadoCatalogo from '../components/EstadoCatalogo.vue'

const catalogo = useCatalogoStore()
const carrito = useCarritoStore()
const perfil = usePerfilStore()
onMounted(() => catalogo.cargar())

function actualizarCantidad(item, event, confirmar = false) {
  if (!event.target.value && !confirmar) return
  if (!carrito.cambiarCantidad(item.id, event.target.value)) event.target.value = item.cantidad
}

const moneda = (valor) => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
}).format(valor)

const whatsappUrl = computed(() => {
  if (!CONFIG_NEGOCIO.whatsapp || !carrito.detalles.length) return ''
  const lineas = carrito.detalles.map((item) =>
    `- ${item.cantidad} × ${item.producto.nombre}: ${moneda(item.producto.precio * item.cantidad)} COP`
  ).join('\n')
  const resumen = `Hola Modo Shake, quisiera consultar este pedido:\n${lineas}\nTotal${carrito.estimado ? ' estimado' : ''}: ${moneda(carrito.total)} COP`
  return `https://wa.me/${CONFIG_NEGOCIO.whatsapp}?text=${encodeURIComponent(resumen)}`
})
</script>

<template>
  <section class="pagina">
    <h1 tabindex="-1">Carrito</h1>
    <p v-if="!perfil.actual">Para guardar una selección, crea un perfil local o entra a uno existente.</p>
    <RouterLink v-if="!perfil.actual" class="boton" to="/perfil">Ir al perfil</RouterLink>
    <template v-else>
      <EstadoCatalogo :estado="catalogo.estado" :error="catalogo.error" @reintentar="catalogo.cargar(true)" />
      <p role="status" aria-live="polite">{{ carrito.aviso || `${carrito.unidades} unidades en tu carrito.` }}</p>
      <div v-if="catalogo.estado === 'listo'">
        <div v-if="carrito.detalles.length" class="carrito-distribucion">
          <ul class="lista-carrito">
            <li v-for="item in carrito.detalles" :key="item.id" class="item-carrito">
              <img :src="`/${item.producto.imagen}`" :alt="item.producto.alt" width="120" height="90">
              <div>
                <strong>{{ item.producto.nombre }}</strong>
                <p>{{ item.producto.precioDesde ? 'Desde ' : '' }}{{ moneda(item.producto.precio) }} COP / unidad</p>
              </div>
              <label :for="`cantidad-${item.id}`">Cantidad</label>
              <input :id="`cantidad-${item.id}`" type="number" min="1" max="99" step="1" :value="item.cantidad" @input="actualizarCantidad(item, $event)" @change="actualizarCantidad(item, $event, true)">
              <strong>{{ moneda(item.producto.precio * item.cantidad) }} COP</strong>
              <button type="button" :aria-label="`Eliminar ${item.producto.nombre} del carrito`" @click="carrito.quitar(item.id)">Eliminar</button>
            </li>
          </ul>
          <aside class="resumen-carrito">
            <h2>Resumen</h2>
            <p>{{ carrito.estimado ? 'Total estimado' : 'Total' }}: <strong>{{ moneda(carrito.total) }} COP</strong></p>
            <p v-if="carrito.estimado">El precio de los suplementos depende de la cantidad.</p>
            <p>WhatsApp abre una consulta; aquí no se procesan pagos.</p>
            <a v-if="whatsappUrl" class="boton" :href="whatsappUrl" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
            <button class="boton-secundario" type="button" @click="carrito.vaciar()">Vaciar carrito</button>
          </aside>
        </div>
        <div v-else>
          <p>Tu carrito está vacío.</p>
          <RouterLink class="boton" to="/productos">Descubrir productos</RouterLink>
        </div>
      </div>
    </template>
  </section>
</template>
