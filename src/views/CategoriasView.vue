<script setup>
import { onMounted } from 'vue'
import { useCatalogoStore } from '../stores/catalogo'
import EstadoCatalogo from '../components/EstadoCatalogo.vue'

const catalogo = useCatalogoStore()
onMounted(() => catalogo.cargar())
const imagenCategoria = (categoria) => catalogo.productos.find((producto) => producto.categoria === categoria)?.imagen
</script>

<template>
  <section class="pagina">
    <p class="etiqueta">ENCUENTRA TU FAVORITO</p>
    <h1 tabindex="-1">Un antojo, muchas opciones.</h1>
    <p>Elige una categoría y descubre lo que tenemos para ti.</p>
    <EstadoCatalogo :estado="catalogo.estado" :error="catalogo.error" @reintentar="catalogo.cargar(true)" />
    <div v-if="catalogo.estado === 'listo'" class="rejilla-categorias">
      <RouterLink
        v-for="categoria in catalogo.categorias"
        :key="categoria"
        class="categoria-visual"
        :to="{ name: 'productos', query: { categoria } }"
      >
        <img :src="`/${imagenCategoria(categoria)}`" alt="" width="960" height="600" loading="lazy">
        <strong>{{ categoria }}</strong>
        <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
    <RouterLink class="boton" to="/productos">Ver todos los productos</RouterLink>
  </section>
</template>
