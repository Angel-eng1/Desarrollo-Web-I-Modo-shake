<script setup>
defineProps({
  estado: { type: String, required: true },
  error: { type: String, default: '' },
})
// El reintento se comunica a la vista; el componente no realiza peticiones.
const emit = defineEmits(['reintentar'])
</script>

<template>
  <div v-if="estado === 'cargando'" role="status" aria-live="polite">
    <p>Cargando productos…</p>
    <div class="esqueletos" aria-hidden="true"><span v-for="n in 3" :key="n"></span></div>
  </div>
  <div v-else-if="estado === 'error'" class="mensaje-error" role="alert">
    <p>{{ error }}</p>
    <button class="boton" type="button" @click="emit('reintentar')">Reintentar carga</button>
  </div>
</template>
