<script setup>
import { computed } from 'vue'

// La tarjeta recibe un producto del catálogo por prop; no modifica el store.
const props = defineProps({
  producto: { type: Object, required: true },
})
const precio = computed(() => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
}).format(props.producto.precio))
</script>

<template>
  <article class="tarjeta-producto">
    <RouterLink :to="{ name: 'producto-detalle', params: { id: producto.id } }" :aria-label="`Ver detalle de ${producto.nombre}`">
      <img :src="`/${producto.imagen}`" :alt="producto.alt" width="960" height="720" loading="lazy">
    </RouterLink>
    <div class="tarjeta-cuerpo">
      <small>{{ producto.categoria }}</small>
      <h2><RouterLink :to="{ name: 'producto-detalle', params: { id: producto.id } }">{{ producto.nombre }}</RouterLink></h2>
      <p>{{ producto.descripcion }}</p>
      <strong>{{ producto.precioDesde ? 'Desde ' : '' }}{{ precio }}</strong>
      <RouterLink class="enlace-detalle" :to="{ name: 'producto-detalle', params: { id: producto.id } }">Ver detalle <i class="bi bi-arrow-right" aria-hidden="true"></i></RouterLink>
    </div>
  </article>
</template>
