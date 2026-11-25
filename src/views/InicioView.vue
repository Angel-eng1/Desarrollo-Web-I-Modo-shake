<script setup>
import { computed, ref } from 'vue'

const publicaciones = [
  {
    id: 'DfGDmK7gEna',
    tipo: 'Reel',
    titulo: 'Mini pancakes en preparación',
    descripcion: 'Un bowl de mini pancakes preparado en Modo Shake.',
    url: 'https://www.instagram.com/reel/DfGDmK7gEna/',
    embed: 'https://www.instagram.com/reel/DfGDmK7gEna/embed/',
  },
  {
    id: 'Dfry-5QEbaz',
    tipo: 'Fotos',
    titulo: 'Una sorpresa para compartir',
    descripcion: 'Batidos y otras opciones de Modo Shake en una publicación del restaurante.',
    url: 'https://www.instagram.com/p/Dfry-5QEbaz/',
    embed: 'https://www.instagram.com/p/Dfry-5QEbaz/embed/',
  },
  {
    id: 'DfYM4nDlKh0',
    tipo: 'Fotos',
    titulo: 'Momentos en Modo Shake',
    descripcion: 'Personas y momentos compartidos en Modo Shake.',
    url: 'https://www.instagram.com/p/DfYM4nDlKh0/',
    embed: 'https://www.instagram.com/p/DfYM4nDlKh0/embed/',
  },
]

const indice = ref(0)
const publicacion = computed(() => publicaciones[indice.value])

function mover(direccion) {
  indice.value = (indice.value + direccion + publicaciones.length) % publicaciones.length
}
</script>

<template>
  <section class="portada">
    <div>
      <p class="etiqueta">Hecho con ingredientes que te hacen bien</p>
      <h1 tabindex="-1">Alimentación saludable, <span>sabor que te encanta.</span></h1>
      <p>Tu pausa rica y nutritiva está en Modo Shake. Descubre batidos, waffles, bowls y mucho más, preparados para acompañar tu ritmo.</p>
      <RouterLink class="boton" to="/categorias">Ver categorías <i class="bi bi-arrow-right" aria-hidden="true"></i></RouterLink>
    </div>
    <figure class="portada-foto">
      <img src="/images/waffles.jpg" width="960" height="960" alt="Waffle de frutos rojos de Modo Shake">
      <figcaption>Tu pausa favorita, en Modo Shake.</figcaption>
    </figure>
    <div class="beneficios" aria-label="Lo que nos inspira">
      <p><i class="bi bi-leaf" aria-hidden="true"></i> Ingredientes frescos</p>
      <p><i class="bi bi-heart" aria-hidden="true"></i> Preparado con cuidado</p>
      <p><i class="bi bi-stars" aria-hidden="true"></i> Opciones para tu ritmo</p>
    </div>
  </section>

  <section class="galeria-instagram" aria-labelledby="galeria-titulo">
    <div class="galeria-encabezado">
      <div>
        <p class="etiqueta">DESDE @MODOSHAKE</p>
        <h2 id="galeria-titulo">Momentos para compartir</h2>
        <p>Explora un Reel y fotos publicados por Modo Shake en Instagram.</p>
      </div>
      <a href="https://www.instagram.com/modoshake/" target="_blank" rel="noopener noreferrer">Seguir en Instagram <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>
    </div>

    <div class="galeria-panel">
      <div class="galeria-info">
        <span class="galeria-tipo">{{ publicacion.tipo }}</span>
        <h3>{{ publicacion.titulo }}</h3>
        <p>{{ publicacion.descripcion }}</p>
        <a :href="publicacion.url" target="_blank" rel="noopener noreferrer">Ver publicación original <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>
        <div class="galeria-controles" aria-label="Controles del carrusel">
          <button type="button" aria-label="Publicación anterior" @click="mover(-1)"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>
          <span aria-live="polite">{{ indice + 1 }} de {{ publicaciones.length }}</span>
          <button type="button" aria-label="Publicación siguiente" @click="mover(1)"><i class="bi bi-arrow-right" aria-hidden="true"></i></button>
        </div>
        <div class="galeria-indicadores" aria-label="Elegir publicación">
          <button
            v-for="(item, posicion) in publicaciones"
            :key="item.id"
            type="button"
            :aria-label="`Mostrar ${item.tipo.toLowerCase()}: ${item.titulo}`"
            :aria-pressed="indice === posicion"
            @click="indice = posicion"
          ></button>
        </div>
      </div>
      <div class="galeria-marco" :class="publicacion.tipo === 'Reel' ? 'es-reel' : 'es-foto'">
        <iframe
          :key="publicacion.id"
          :src="publicacion.embed"
          :title="`${publicacion.tipo} de Modo Shake: ${publicacion.titulo}`"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>
