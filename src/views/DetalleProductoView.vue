<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { CONFIG_NEGOCIO } from '../config/negocio'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogoStore } from '../stores/catalogo'
import { useCarritoStore } from '../stores/carrito'
import { usePerfilStore } from '../stores/perfil'
import EstadoCatalogo from '../components/EstadoCatalogo.vue'

const route = useRoute()
const router = useRouter()
const catalogo = useCatalogoStore()
const carrito = useCarritoStore()
const perfil = usePerfilStore()
const aviso = ref('')

onMounted(() => catalogo.cargar())

const producto = computed(() => catalogo.obtenerPorId(route.params.id))
const formatoPrecio = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
})
const precio = computed(() => producto.value ? formatoPrecio.format(producto.value.precio) : '')

// Las sugerencias salen del catálogo real y cambian al abrir otro producto.
const relacionados = computed(() => {
  if (!producto.value) return []
  const otros = catalogo.productos.filter((item) => item.id !== producto.value.id)
  return [
    ...otros.filter((item) => item.categoria === producto.value.categoria),
    ...otros.filter((item) => item.categoria !== producto.value.categoria),
  ].slice(0, 3)
})

const consultaUrl = computed(() => producto.value && CONFIG_NEGOCIO.whatsapp
  ? `https://wa.me/${CONFIG_NEGOCIO.whatsapp}?text=${encodeURIComponent(`Hola, quisiera consultar por ${producto.value.nombre}.`)}`
  : '')

watch([producto, () => catalogo.estado], ([actual, estado]) => {
  aviso.value = ''
  if (estado === 'listo') document.title = `${actual ? actual.nombre : 'Producto no encontrado'} | Modo Shake`
}, { immediate: true })

function agregar() {
  if (!producto.value) return
  if (!perfil.actual) {
    perfil.pendienteId = producto.value.id
    router.push('/perfil')
    return
  }
  carrito.agregar(producto.value.id)
  aviso.value = carrito.aviso
}
</script>

<template>
  <section class="pagina pagina-detalle">
    <EstadoCatalogo :estado="catalogo.estado" :error="catalogo.error" @reintentar="catalogo.cargar(true)" />

    <template v-if="producto && catalogo.estado === 'listo'">
      <nav class="migas-detalle" aria-label="Ruta de navegación">
        <RouterLink to="/">Inicio</RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink to="/productos">Productos</RouterLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ producto.nombre }}</span>
      </nav>

      <article class="detalle-producto">
        <div class="detalle-visual">
          <img :src="`/${producto.imagen}`" :alt="producto.alt">
          <span class="detalle-sello">Modo Shake</span>
        </div>

        <div class="detalle-contenido">
          <RouterLink class="detalle-categoria" :to="{ name: 'productos', query: { categoria: producto.categoria } }">
            {{ producto.categoria }} <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
          </RouterLink>
          <h1 tabindex="-1">{{ producto.nombre }}</h1>
          <p class="detalle-descripcion">{{ producto.descripcion }}</p>

          <div class="detalle-compra">
            <span class="detalle-precio-etiqueta">{{ producto.precioDesde ? 'Precio desde' : 'Precio' }}</span>
            <strong class="detalle-precio">{{ precio }}</strong>
            <p v-if="producto.precioDesde">El valor final depende de la cantidad. Confírmalo antes de pedir.</p>
          </div>

          <div class="detalle-acciones">
            <button class="boton" type="button" @click="agregar">
              <i class="bi bi-bag-plus" aria-hidden="true"></i> Agregar al carrito
            </button>
            <a v-if="consultaUrl" :href="consultaUrl" target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
            </a>
          </div>
          <p v-if="!perfil.actual" class="detalle-ayuda">Para agregarlo al carrito, primero entra o crea un perfil local.</p>
          <p class="detalle-aviso" role="status" aria-live="polite">{{ aviso }}</p>
        </div>
      </article>

      <section v-if="relacionados.length" class="descubre-productos" aria-labelledby="titulo-descubre">
        <div class="descubre-encabezado">
          <div>
            <p class="etiqueta">SIGUE EXPLORANDO</p>
            <h2 id="titulo-descubre">También te puede interesar</h2>
          </div>
          <RouterLink to="/productos">Ver todo el catálogo <i class="bi bi-arrow-right" aria-hidden="true"></i></RouterLink>
        </div>
        <div class="rejilla-relacionados">
          <RouterLink v-for="item in relacionados" :key="item.id" class="producto-relacionado" :to="{ name: 'producto-detalle', params: { id: item.id } }">
            <img :src="`/${item.imagen}`" alt="" loading="lazy">
            <span>{{ item.categoria }}</span>
            <strong>{{ item.nombre }}</strong>
            <small>{{ item.precioDesde ? 'Desde ' : '' }}{{ formatoPrecio.format(item.precio) }}</small>
          </RouterLink>
        </div>
      </section>

      <aside v-if="CONFIG_NEGOCIO.instagram || CONFIG_NEGOCIO.tiktok" class="detalle-redes" aria-label="Redes de Modo Shake">
        <div>
          <p class="etiqueta">MÁS DE MODO SHAKE</p>
          <h2>Antójate también en nuestras redes</h2>
          <p>Mira fotos y videos del restaurante en sus perfiles oficiales.</p>
        </div>
        <div class="detalle-redes-enlaces">
          <a v-if="CONFIG_NEGOCIO.instagram" :href="`https://www.instagram.com/${CONFIG_NEGOCIO.instagram}/`" target="_blank" rel="noopener noreferrer">
            <i class="bi bi-instagram" aria-hidden="true"></i> Instagram <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
          </a>
          <a v-if="CONFIG_NEGOCIO.tiktok" :href="`https://www.tiktok.com/@${CONFIG_NEGOCIO.tiktok}`" target="_blank" rel="noopener noreferrer">
            <i class="bi bi-tiktok" aria-hidden="true"></i> TikTok <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
          </a>
        </div>
      </aside>
    </template>

    <div v-else-if="catalogo.estado === 'listo'" class="detalle-no-encontrado">
      <h1 tabindex="-1">Producto no encontrado</h1>
      <p>No encontramos ese producto en el catálogo.</p>
      <RouterLink class="boton" to="/productos">Ver productos</RouterLink>
    </div>
  </section>
</template>
