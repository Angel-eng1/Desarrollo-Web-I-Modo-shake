<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogoStore } from '../stores/catalogo'
import { useCarritoStore } from '../stores/carrito'
import { usePerfilStore } from '../stores/perfil'
import EstadoCatalogo from '../components/EstadoCatalogo.vue'

const route = useRoute()
const router = useRouter()
const carrito = useCarritoStore()
const perfil = usePerfilStore()
function agregar() {
  if (!perfil.actual) {
    perfil.pendienteId = producto.value.id
    router.push('/perfil')
    return
  }
  carrito.agregar(producto.value.id)
}
const catalogo = useCatalogoStore()
onMounted(() => catalogo.cargar())
const producto = computed(() => catalogo.obtenerPorId(route.params.id))
const precio = computed(() => producto.value ? new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
}).format(producto.value.precio) : '')
</script>

<template>
  <section class="pagina">
    <EstadoCatalogo :estado="catalogo.estado" :error="catalogo.error" @reintentar="catalogo.cargar(true)" />
    <article v-if="producto && catalogo.estado === 'listo'" class="detalle-producto">
      <img :src="`/${producto.imagen}`" :alt="producto.alt" width="960" height="720">
      <div>
        <p class="etiqueta">{{ producto.categoria }}</p>
        <h1 tabindex="-1">{{ producto.nombre }}</h1>
        <p>{{ producto.descripcion }}</p>
        <strong>{{ producto.precioDesde ? 'Desde ' : '' }}{{ precio }}</strong>
        <button class="boton" type="button" @click="agregar">Agregar al carrito</button>
        <p role="status" aria-live="polite">{{ carrito.aviso }}</p>
        <p><RouterLink to="/productos">Volver a productos</RouterLink></p>
      </div>
    </article>
    <div v-else-if="catalogo.estado === 'listo'">
      <h1 tabindex="-1">Producto no encontrado</h1>
      <p>No encontramos ese producto en el catálogo.</p>
      <RouterLink class="boton" to="/productos">Ver productos</RouterLink>
    </div>
  </section>
</template>
