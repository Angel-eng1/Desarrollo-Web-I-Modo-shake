<script setup>
import { computed, ref } from 'vue'
import { CONFIG_NEGOCIO } from '../config/negocio'
import { useConsultasStore } from '../stores/consultas'

const consultasStore = useConsultasStore()
const formulario = ref(null)
const errores = ref({})
const whatsappUrl = CONFIG_NEGOCIO.whatsapp ? `https://wa.me/${CONFIG_NEGOCIO.whatsapp}` : ''
const fechaMinima = computed(() => {
  const hoy = new Date()
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
})
const motivos = { menu: 'Consulta del menú', ubicacion: 'Ubicación u horario', otro: 'Otra consulta' }

function mensajeCampo(campo) {
  const validez = campo.validity
  if (validez.valueMissing) return 'Este campo es obligatorio.'
  if (validez.typeMismatch) return 'Escribe un correo electrónico válido.'
  if (validez.patternMismatch) return 'Escribe 10 números, sin espacios ni letras.'
  if (validez.tooShort) return `Escribe al menos ${campo.minLength} caracteres.`
  if (validez.tooLong) return `Escribe máximo ${campo.maxLength} caracteres.`
  if (validez.rangeUnderflow) return `El valor mínimo es ${campo.min}.`
  if (validez.rangeOverflow) return `El valor máximo es ${campo.max}.`
  if (validez.badInput || validez.stepMismatch) return 'Escribe un número entero válido.'
  if (campo.name === 'fecha' && campo.value && campo.value < fechaMinima.value) return 'Elige una fecha de hoy o posterior.'
  return ''
}

function validar(campo) {
  errores.value[campo.name] = mensajeCampo(campo)
  return !errores.value[campo.name]
}

function alEditar(event) {
  validar(event.target)
  consultasStore.guardarBorrador()
}

function enviar() {
  const campos = [...formulario.value.querySelectorAll('input, select, textarea')]
  const invalidos = campos.filter((campo) => !validar(campo))
  if (invalidos.length) {
    consultasStore.aviso = 'Revisa los campos marcados antes de guardar la consulta.'
    invalidos[0].focus()
    return
  }
  if (consultasStore.guardarConsulta()) errores.value = {}
}
</script>

<template>
  <section class="pagina pagina-contacto">
    <p class="etiqueta">NOS VEMOS PRONTO</p>
    <h1 tabindex="-1">Contáctanos</h1>
    <p>Déjanos tus datos y cuéntanos qué necesitas.</p>

    <aside class="ubicacion-negocio">
      <h2>Dónde encontrarnos</h2>
      <p>Sahagún, Córdoba</p>
      <p class="horario">{{ CONFIG_NEGOCIO.horario }}</p>
      <p v-if="CONFIG_NEGOCIO.direccion">{{ CONFIG_NEGOCIO.direccion }}</p>
      <p v-else-if="whatsappUrl"><a :href="whatsappUrl" target="_blank" rel="noopener noreferrer">¿Quieres saber cómo llegar? Escríbenos por WhatsApp.</a></p>
    </aside>

    <form ref="formulario" class="formulario-contacto" novalidate @submit.prevent="enviar">
      <div class="campo-formulario">
        <label for="nombre">Nombre completo</label>
        <input id="nombre" v-model="consultasStore.borrador.nombre" name="nombre" minlength="3" maxlength="60" autocomplete="name" required :aria-invalid="Boolean(errores.nombre)" aria-describedby="error-nombre" @input="alEditar" @change="alEditar">
        <small id="error-nombre" class="error-campo">{{ errores.nombre }}</small>
      </div>
      <div class="campo-formulario">
        <label for="correo">Correo electrónico</label>
        <input id="correo" v-model="consultasStore.borrador.correo" type="email" name="correo" autocomplete="email" required :aria-invalid="Boolean(errores.correo)" aria-describedby="error-correo" @input="alEditar" @change="alEditar">
        <small id="error-correo" class="error-campo">{{ errores.correo }}</small>
      </div>
      <div class="campo-formulario">
        <label for="telefono">Teléfono</label>
        <input id="telefono" v-model="consultasStore.borrador.telefono" type="tel" name="telefono" pattern="[0-9]{10}" title="Escribe 10 números, sin espacios" autocomplete="tel" required :aria-invalid="Boolean(errores.telefono)" aria-describedby="ayuda-telefono error-telefono" @input="alEditar" @change="alEditar">
        <small id="ayuda-telefono">10 números, sin espacios.</small>
        <small id="error-telefono" class="error-campo">{{ errores.telefono }}</small>
      </div>
      <div class="campo-formulario">
        <label for="fecha">Fecha en que nos visitarás</label>
        <input id="fecha" v-model="consultasStore.borrador.fecha" type="date" name="fecha" :min="fechaMinima" required :aria-invalid="Boolean(errores.fecha)" aria-describedby="ayuda-fecha error-fecha" @input="alEditar" @change="alEditar">
        <small id="ayuda-fecha">Elige una fecha de hoy o posterior.</small>
        <small id="error-fecha" class="error-campo">{{ errores.fecha }}</small>
      </div>
      <div class="campo-formulario">
        <label for="personas">Número de personas</label>
        <input id="personas" v-model="consultasStore.borrador.personas" type="number" name="personas" min="1" max="12" step="1" required :aria-invalid="Boolean(errores.personas)" aria-describedby="ayuda-personas error-personas" @input="alEditar" @change="alEditar">
        <small id="ayuda-personas">De 1 a 12 personas.</small>
        <small id="error-personas" class="error-campo">{{ errores.personas }}</small>
      </div>
      <div class="campo-formulario">
        <label for="motivo">Motivo de tu consulta</label>
        <select id="motivo" v-model="consultasStore.borrador.motivo" name="motivo" required :aria-invalid="Boolean(errores.motivo)" aria-describedby="error-motivo" @change="alEditar">
          <option value="" disabled>Selecciona una opción</option>
          <option value="menu">Consultar el menú</option>
          <option value="ubicacion">Consultar ubicación u horario</option>
          <option value="otro">Otro</option>
        </select>
        <small id="error-motivo" class="error-campo">{{ errores.motivo }}</small>
      </div>
      <div class="campo-formulario campo-ancho">
        <label for="mensaje">Mensaje</label>
        <textarea id="mensaje" v-model="consultasStore.borrador.mensaje" name="mensaje" rows="4" maxlength="400" :aria-invalid="Boolean(errores.mensaje)" aria-describedby="error-mensaje" @input="alEditar" @change="alEditar"></textarea>
        <small id="error-mensaje" class="error-campo">{{ errores.mensaje }}</small>
      </div>
      <button class="boton" type="submit">Guardar consulta <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
    </form>

    <p>Tu consulta se guarda únicamente en este navegador. No se envía al restaurante.</p>
    <p role="status" aria-live="polite">{{ consultasStore.aviso }}</p>
    <details class="consultas-guardadas">
      <summary>Consultas guardadas en este navegador ({{ consultasStore.consultas.length }})</summary>
      <p>Se pueden revisar al volver a abrir esta página en el mismo navegador.</p>
      <ul>
        <li v-if="!consultasStore.consultas.length">Aún no tienes consultas guardadas.</li>
        <li v-for="consulta in consultasStore.consultas" :key="consulta.id">
          <strong>{{ consulta.nombre }}</strong>
          <p>{{ motivos[consulta.motivo] || 'Consulta' }} · {{ consulta.fecha }} · {{ consulta.personas }} persona(s)</p>
          <details>
            <summary>Ver datos guardados</summary>
            <p>Correo: {{ consulta.correo }} · Teléfono: {{ consulta.telefono }}</p>
            <p>{{ consulta.mensaje || 'Sin mensaje adicional.' }}</p>
          </details>
          <button type="button" :aria-label="`Eliminar consulta de ${consulta.nombre}`" @click="consultasStore.eliminar(consulta.id)">Eliminar</button>
        </li>
      </ul>
    </details>
  </section>
</template>
