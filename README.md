# Modo Shake — primer avance

Prototipo frontend estático para la propuesta de aplicación web de Modo Shake (Sahagún, Córdoba).

## Alcance de esta entrega

- Estructura semántica con HTML5: `header`, `nav`, `main`, `section`, `article`, `aside` y `footer`.
- Página de inicio, menú por categorías, tarjetas de producto, información del restaurante y contacto.
- Maquetación con CSS Grid y Flexbox, adaptada para móvil, tablet y escritorio mediante media queries.
- Ilustración vectorial SVG local para el encabezado, tipografía de Google Fonts e iconografía de Bootstrap Icons.
- Formulario con validación nativa del navegador: campos obligatorios, correo, patrón para teléfono, fecha y cantidad mínima/máxima.

## Abrir el prototipo

Abre la carpeta del proyecto en Visual Studio Code y ejecuta `index.html` con Live Server. La carga de `data.json` requiere un servidor HTTP local; no abras el HTML directamente con doble clic. Se recomienda conexión a Internet para cargar la tipografía y los iconos desde sus CDN.

## Alcance académico

En este primer avance no se incluye JavaScript, persistencia, carrito funcional ni backend. El formulario es una maqueta y no transmite información. Según la guía, el segundo avance incorpora interacción con JavaScript y almacenamiento local; la entrega final migra a Vue.js. La propuesta original menciona React, pero el camino previsto para ajustarse a la guía de evaluación es Vue.js.


## Avance 2 en desarrollo: catálogo dinámico

Los productos se almacenan en `data.json` y se cargan desde `catalogo.js` con Fetch y async/await. JavaScript genera las tarjetas y muestra mensajes de carga, catálogo vacío o error, con una opción para reintentar. Se comprueban los estados HTTP y el formato de los datos.

El catálogo permite buscar por nombre y filtrar por categoría simultáneamente, sin distinguir mayúsculas ni tildes en la búsqueda. Incluye un botón para limpiar los filtros y un aviso cuando no hay coincidencias.

Todavía están pendientes el carrito y la persistencia y validación dinámica del formulario.
