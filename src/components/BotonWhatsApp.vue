<script setup>
import { CONFIG_NEGOCIO } from '../config/negocio'

const enlace = CONFIG_NEGOCIO.whatsapp ? `https://wa.me/${CONFIG_NEGOCIO.whatsapp}` : ''
</script>

<template>
  <a
    v-if="enlace"
    class="whatsapp-flotante"
    :href="enlace"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chatear con Modo Shake por WhatsApp"
    title="Chatear por WhatsApp"
  >
    <i class="bi bi-whatsapp" aria-hidden="true"></i>
  </a>
</template>
