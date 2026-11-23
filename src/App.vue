<script setup>
import { onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import EncabezadoSitio from './components/EncabezadoSitio.vue'
import PieSitio from './components/PieSitio.vue'
import BotonWhatsApp from './components/BotonWhatsApp.vue'

const route = useRoute()

async function enfocarTitulo() {
  await nextTick()
  document.querySelector('main h1')?.focus()
}
onMounted(enfocarTitulo)
</script>

<template>
  <a class="salto-contenido" href="#contenido">Saltar al contenido</a>
  <EncabezadoSitio />
  <main id="contenido">
    <RouterView v-slot="{ Component }">
      <Transition name="vista" mode="out-in" @after-enter="enfocarTitulo">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </main>
  <PieSitio />
  <BotonWhatsApp />
</template>
