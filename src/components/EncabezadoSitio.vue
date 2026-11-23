<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCarritoStore } from '../stores/carrito'
import { usePerfilStore } from '../stores/perfil'

const abierto = ref(false)
const route = useRoute()
const carrito = useCarritoStore()
const perfil = usePerfilStore()

function cerrarMenu() {
  abierto.value = false
}

function alPulsarTecla(event) {
  if (event.key === 'Escape' && abierto.value) {
    cerrarMenu()
    document.querySelector('.boton-menu')?.focus()
  }
}

watch(() => route.fullPath, cerrarMenu)
onMounted(() => window.addEventListener('keydown', alPulsarTecla))
onUnmounted(() => window.removeEventListener('keydown', alPulsarTecla))
</script>

<template>
  <header class="encabezado">
    <RouterLink class="marca" to="/" aria-label="Modo Shake, ir al inicio" @click="cerrarMenu">
      <img class="logo" src="/images/logo-modoshake.jpg" width="56" height="56" alt="">
      <span class="marca-texto">modo<span>shake</span><small>FRESH · FIT · HAPPY</small></span>
    </RouterLink>

    <button
      class="boton-menu"
      type="button"
      aria-controls="menu-principal"
      :aria-expanded="abierto"
      :aria-label="abierto ? 'Cerrar menú' : 'Abrir menú'"
      @click="abierto = !abierto"
    >
      <i :class="abierto ? 'bi bi-x-lg' : 'bi bi-list'" aria-hidden="true"></i>
    </button>

    <nav id="menu-principal" :class="{ 'menu-abierto': abierto }" aria-label="Navegación principal">
      <ul>
        <li><RouterLink to="/" @click="cerrarMenu">Inicio</RouterLink></li>
        <li><RouterLink to="/productos" @click="cerrarMenu">Productos</RouterLink></li>
        <li><RouterLink to="/nosotros" @click="cerrarMenu">Nosotros</RouterLink></li>
        <li><RouterLink to="/contacto" @click="cerrarMenu">Contacto</RouterLink></li>
      </ul>
    </nav>

    <div class="acciones-encabezado">
      <RouterLink class="boton boton-categorias-encabezado" to="/categorias">
        Ver categorías <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
      </RouterLink>
      <RouterLink class="enlace-icono" to="/carrito" :aria-label="`Carrito, ${carrito.unidades} productos`" title="Ver carrito">
        <i class="bi bi-cart3" aria-hidden="true"></i><span class="insignia" aria-hidden="true">{{ carrito.unidades }}</span>
      </RouterLink>
      <RouterLink class="enlace-icono" to="/perfil" :aria-label="perfil.actual ? `Perfil de ${perfil.actual.nombre}` : 'Perfil, entrar o registrarse'" title="Perfil">
        <i class="bi bi-person-circle" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </header>
</template>
