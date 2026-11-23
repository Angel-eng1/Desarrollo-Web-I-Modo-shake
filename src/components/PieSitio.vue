<script setup>
import { CONFIG_NEGOCIO } from '../config/negocio'

const whatsappUrl = CONFIG_NEGOCIO.whatsapp ? `https://wa.me/${CONFIG_NEGOCIO.whatsapp}` : ''
</script>

<template>
  <footer class="pie">
    <div>
      <strong>Modo Shake</strong>
      <p>Comida saludable en Sahagún, Córdoba.</p>
      <p v-if="CONFIG_NEGOCIO.direccion">{{ CONFIG_NEGOCIO.direccion }}</p>
      <p v-else-if="whatsappUrl">
        <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer">
          ¿Quieres saber cómo llegar? Escríbenos por WhatsApp.
        </a>
      </p>
    </div>
    <nav aria-label="Navegación del pie">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/categorias">Categorías</RouterLink>
      <RouterLink to="/productos">Productos</RouterLink>
      <RouterLink to="/contacto">Contacto</RouterLink>
    </nav>
    <div class="redes">
      <a :href="`https://www.instagram.com/${CONFIG_NEGOCIO.instagram}/`" target="_blank" rel="noopener noreferrer">Instagram: @{{ CONFIG_NEGOCIO.instagram }}</a>
      <a :href="`https://www.tiktok.com/@${CONFIG_NEGOCIO.tiktok}`" target="_blank" rel="noopener noreferrer">TikTok: @{{ CONFIG_NEGOCIO.tiktok }}</a>
    </div>
  </footer>
</template>
