<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogoStore } from '../stores/catalogo'
import EstadoCatalogo from '../components/EstadoCatalogo.vue'
import FiltroCategoria from '../components/FiltroCategoria.vue'
import TarjetaProducto from '../components/TarjetaProducto.vue'

const catalogo = useCatalogoStore()
const route = useRoute()
const busqueda = ref('')
const categoria = ref(typeof route.query.categoria === 'string' ? route.query.categoria : '')
watch(() => route.query.categoria, (valor) => { categoria.value = typeof valor === 'string' ? valor : '' })
onMounted(() => catalogo.cargar())

const normalizar = (texto) => texto.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const filtrados = computed(() => catalogo.productos.filter((producto) =>
  (!categoria.value || producto.categoria === categoria.value) &&
  normalizar(producto.nombre).includes(normalizar(busqueda.value))
))
function limpiar() {
  busqueda.value = ''
  categoria.value = ''
}
</script>

<template>
  <section class="pagina">
    <p class="etiqueta">PREPARADOS PARA TU DÍA</p>
    <h1 tabindex="-1">Elige algo que te encante.</h1>
    <p>Busca tu favorito entre los productos del catálogo.</p>
    <div class="busqueda-catalogo">
      <label for="buscar-producto">Buscar por nombre</label>
      <input id="buscar-producto" v-model="busqueda" type="search" placeholder="Por ejemplo: batido" aria-controls="listado-productos" :disabled="catalogo.estado !== 'listo'">
      <button class="boton" type="button" :disabled="catalogo.estado !== 'listo'" @click="limpiar">Limpiar filtros</button>
    </div>
    <div v-if="catalogo.estado === 'listo'" class="filtros" role="group" aria-label="Categorías de productos">
      <FiltroCategoria categoria="" :seleccionada="!categoria" @seleccionar="categoria = $event" />
      <FiltroCategoria v-for="opcion in catalogo.categorias" :key="opcion" :categoria="opcion" :seleccionada="categoria === opcion" @seleccionar="categoria = $event" />
    </div>
    <EstadoCatalogo :estado="catalogo.estado" :error="catalogo.error" @reintentar="catalogo.cargar(true)" />
    <p v-if="catalogo.estado === 'listo'" role="status" aria-live="polite">{{ filtrados.length }} {{ filtrados.length === 1 ? 'producto encontrado' : 'productos encontrados' }}.</p>
    <div v-if="catalogo.estado === 'listo' && filtrados.length" id="listado-productos" class="rejilla-productos">
      <TarjetaProducto v-for="producto in filtrados" :key="producto.id" :producto="producto" />
    </div>
    <div v-else-if="catalogo.estado === 'listo'" class="sin-resultados">
      <h2>No encontramos coincidencias</h2>
      <p>Prueba otro nombre o cambia la categoría.</p>
      <button class="boton" type="button" @click="limpiar">Ver todos los productos</button>
    </div>
  </section>
</template>
