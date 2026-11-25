<script setup>
import { ref } from 'vue'

const reelActivo = ref(false)
const urlReel = 'https://www.instagram.com/reel/DfGDmK7gEna/'
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

  <section class="reel-destacado" aria-labelledby="reel-titulo">
    <div class="reel-texto">
      <p class="etiqueta">DESDE NUESTRO INSTAGRAM</p>
      <h2 id="reel-titulo">Un vistazo a Modo Shake</h2>
      <p>Mira cómo preparan un bowl de mini pancakes en este Reel de @modoshake.</p>
      <a :href="urlReel" target="_blank" rel="noopener noreferrer">Ver Reel en Instagram <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>
      <p class="reel-nota">El video se carga desde Instagram al pulsar reproducir.</p>
    </div>
    <div class="reel-marco">
      <iframe
        v-if="reelActivo"
        src="https://www.instagram.com/reel/DfGDmK7gEna/embed/"
        title="Reel de Modo Shake: preparación de un bowl de mini pancakes"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
      <button v-else class="reel-portada" type="button" aria-label="Reproducir Reel de Modo Shake" @click="reelActivo = true">
        <img src="/images/pancake.jpg" width="960" height="960" alt="" loading="lazy">
        <span class="reel-reproducir"><i class="bi bi-play-fill" aria-hidden="true"></i><span>Reproducir Reel</span></span>
      </button>
    </div>
  </section>
</template>
