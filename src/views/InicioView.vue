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
</template>
