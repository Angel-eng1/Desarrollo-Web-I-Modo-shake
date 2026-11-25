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
const mostrarConfiguracion = import.meta.env.DEV

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

async function entrarGoogle() {
  if (await perfil.entrarGoogle()) continuar()
}
</script>

<template>
  <section class="pagina">
    <h1 tabindex="-1">Perfil</h1>
    <p>Los perfiles locales son una demostración sin contraseña. Google verifica la identidad cuando este acceso está configurado. El carrito se guarda solo en este navegador.</p>
    <p v-if="perfil.pendienteId !== null">{{ perfil.googleDisponible ? 'Entra con Google o usa un perfil local para agregar el producto al carrito.' : 'Crea un perfil local o entra para agregar el producto al carrito.' }}</p>
    <p role="status" aria-live="polite">{{ perfil.aviso }}</p>

    <div v-if="perfil.actual" class="panel-perfil">
      <h2>{{ perfil.actual.proveedor === 'google' ? 'Cuenta Google' : 'Sesión local' }}</h2>
      <p>Nombre: {{ perfil.actual.nombre }}</p>
      <p>Correo: {{ perfil.actual.correo }}</p>
      <RouterLink to="/carrito">Ver carrito</RouterLink>
      <div class="acciones-perfil">
        <button v-if="perfil.actual.proveedor === 'google'" class="boton" type="button" @click="perfil.cerrarGoogle()">Cerrar sesión de Google</button>
        <template v-else>
          <button class="boton" type="button" @click="perfil.cerrar()">Cerrar sesión</button>
          <button class="boton-secundario" type="button" @click="perfil.eliminar()">Eliminar perfil y carrito local</button>
        </template>
      </div>
    </div>

    <template v-else>
      <div v-if="perfil.googleDisponible || mostrarConfiguracion" class="acceso-google">
        <div>
          <h2>Entrar o registrarse con Google</h2>
          <p>Si es tu primera vez, tu cuenta se crea al continuar. El carrito se guarda en este navegador.</p>
        </div>
        <button class="boton-google" type="button" :disabled="!perfil.googleDisponible || perfil.googleCargando" @click="entrarGoogle">
          <i class="bi bi-google" aria-hidden="true"></i>
          {{ perfil.googleCargando ? 'Abriendo Google…' : 'Continuar con Google' }}
        </button>
        <p v-if="mostrarConfiguracion && !perfil.googleDisponible" class="aviso-configuracion">Falta configurar Firebase para probar este acceso en local.</p>
      </div>
      <div class="formularios-perfil">
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
    </template>
  </section>
</template>
