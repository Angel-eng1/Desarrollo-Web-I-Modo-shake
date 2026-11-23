<script setup>
// El botón recibe la categoría por prop y avisa al padre mediante un emit.
defineProps({
  categoria: { type: String, required: true },
  seleccionada: { type: Boolean, required: true },
})
const emit = defineEmits(['seleccionar'])
</script>

<template>
  <button type="button" :aria-pressed="seleccionada" aria-controls="listado-productos" @click="emit('seleccionar', categoria)">
    {{ categoria || 'Todas' }}
  </button>
</template>
