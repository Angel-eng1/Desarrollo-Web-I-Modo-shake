<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePerfilStore } from '../stores/perfil'
import { useCarritoStore } from '../stores/carrito'

const perfil = usePerfilStore()
const carrito = useCarritoStore()
const router = useRouter()
const nombre = ref('')
const correoRegistro = ref('')
const correoIngreso = ref('')

function continuar() {
  const pendiente = perfil.pendienteId
  perfil.pendienteId = null
  if (pendiente !== null && carrito.agregar(pendiente)) router.push('/carrito')
}

function registrar() {
  if (perfil.registrar(nombre.value, correoRegistro.value)) {
    nombre.value = ''
    correoRegistro.value = ''
    continuar()
  }
}

function entrar() {
  if (perfil.entrar(correoIngreso.value)) {
    correoIngreso.value = ''
    continuar()
  }
}
</script>

<template>
  <section class="pagina">
    <h1 tabindex="-1">Perfil</h1>
    <p>Los perfiles de demostración se guardan solo en este navegador. No tienen contraseña ni verifican identidad.</p>
    <p v-if="perfil.pendienteId !== null">Crea un perfil o entra para agregar el producto al carrito.</p>
    <p role="status" aria-live="polite">{{ perfil.aviso }}</p>

    <div v-if="perfil.actual" class="panel-perfil">
      <h2>Sesión local</h2>
      <p>Nombre: {{ perfil.actual.nombre }}</p>
      <p>Correo: {{ perfil.actual.correo }}</p>
      <RouterLink to="/carrito">Ver carrito</RouterLink>
      <div class="acciones-perfil">
        <button class="boton" type="button" @click="perfil.cerrar()">Cerrar sesión</button>
        <button class="boton-secundario" type="button" @click="perfil.eliminar()">Eliminar perfil y carrito local</button>
      </div>
    </div>

    <div v-else class="formularios-perfil">
      <form @submit.prevent="registrar">
        <h2>Crear perfil local</h2>
        <label for="nombre-registro">Nombre</label>
        <input id="nombre-registro" v-model.trim="nombre" name="nombre" minlength="3" required autocomplete="name">
        <label for="correo-registro">Correo</label>
        <input id="correo-registro" v-model.trim="correoRegistro" name="correo" type="email" required autocomplete="email">
        <button class="boton" type="submit">Registrarme</button>
      </form>
      <form @submit.prevent="entrar">
        <h2>Entrar a un perfil local</h2>
        <label for="correo-ingreso">Correo registrado en este navegador</label>
        <input id="correo-ingreso" v-model.trim="correoIngreso" name="correo" type="email" required autocomplete="email">
        <button class="boton" type="submit">Entrar</button>
      </form>
    </div>
  </section>
</template>
