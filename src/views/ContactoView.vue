<script setup>
import { CONFIG_NEGOCIO } from '../config/negocio'
const whatsappUrl = CONFIG_NEGOCIO.whatsapp ? `https://wa.me/${CONFIG_NEGOCIO.whatsapp}` : ''
</script>

<template>
  <section class="pagina">
    <h1 tabindex="-1">Contacto</h1>
    <p>Horario de atención:</p>
    <p class="horario">{{ CONFIG_NEGOCIO.horario }}</p>
    <p v-if="CONFIG_NEGOCIO.direccion">{{ CONFIG_NEGOCIO.direccion }}</p>
    <p v-else-if="whatsappUrl"><a :href="whatsappUrl" target="_blank" rel="noopener noreferrer">¿Quieres saber cómo llegar? Escríbenos por WhatsApp.</a></p>
    <p>El formulario se migrará en una fase posterior.</p>
  </section>
</template>
