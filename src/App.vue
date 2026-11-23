<script setup>
import { nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import EncabezadoSitio from './components/EncabezadoSitio.vue'
import PieSitio from './components/PieSitio.vue'
import BotonWhatsApp from './components/BotonWhatsApp.vue'

const route = useRoute()

watch(() => route.fullPath, async () => {
  await nextTick()
  document.querySelector('main h1')?.focus()
})
</script>

<template>
  <a class="salto-contenido" href="#contenido">Saltar al contenido</a>
  <EncabezadoSitio />
  <main id="contenido">
    <RouterView v-slot="{ Component }">
      <Transition name="vista" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </main>
  <PieSitio />
  <BotonWhatsApp />
</template>
