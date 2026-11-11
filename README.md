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

El primer avance consistió en HTML y CSS. En el segundo se incorporó JavaScript, catálogo dinámico, carrito y guardado local de consultas. La información del formulario no se transmite a un servidor. Según la guía, el segundo avance incorpora interacción con JavaScript y almacenamiento local; la entrega final migra a Vue.js. La propuesta original menciona React, pero el camino previsto para ajustarse a la guía de evaluación es Vue.js.


## Avance 2 en desarrollo: catálogo dinámico

Los productos se almacenan en `data.json` y se cargan desde `app.js` con Fetch y async/await. JavaScript genera las tarjetas y muestra mensajes de carga, catálogo vacío o error, con una opción para reintentar. Se comprueban los estados HTTP y el formato de los datos.

El catálogo permite buscar por nombre y filtrar por categoría simultáneamente, sin distinguir mayúsculas ni tildes en la búsqueda. Incluye un botón para limpiar los filtros y un aviso cuando no hay coincidencias.

El carrito permite agregar productos, modificar cantidades enteras entre 1 y 99, eliminar productos y vaciar la selección. Calcula el total y guarda identificadores y cantidades en localStorage. Para suplementos muestra un total estimado. El carrito no procesa pedidos ni pagos.

Para comprobar la persistencia, recarga usando la misma dirección y puerto de Live Server: el almacenamiento pertenece a ese origen y navegador.

El formulario muestra errores junto a cada campo mientras se escribe y exige una fecha actual o futura. Guarda el borrador y las consultas válidas en localStorage; se pueden revisar y eliminar desde la misma página. Los datos permanecen únicamente en este navegador: no se envían al restaurante ni se guardan en un servidor.

## Navegación y diseño de las vistas

Inicio, Catálogo, Productos, Carrito, Nosotros y Contacto se muestran como vistas independientes mediante JavaScript nativo y enlaces con hash. Se puede usar Atrás/Adelante y abrir enlaces directos a cada vista. El catálogo presenta categorías visuales que llevan a productos filtrados. Las transiciones respetan la preferencia de movimiento reducido del dispositivo.

El carrito presenta imágenes, cantidades, subtotales y un resumen, con avisos al agregar productos. Estas vistas conservan HTML semántico, Grid, Flexbox y estilos adaptables; Vue Router se incorporará en la entrega final.

## Organización de JavaScript

Toda la lógica de carrito, catálogo, filtros, navegación y formulario está en `app.js`. Sus bloques están separados por comentarios para poder estudiar cada funcionalidad.
