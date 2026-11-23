# Modo Shake — entrega final

Aplicación web académica de Modo Shake (Sahagún, Córdoba). Esta rama contiene la base Vue 3 con Vite, Vue Router y Pinia para migrar por fases la aplicación del Avance 2. La migración de las vistas y funciones aún está en curso; la versión anterior se conserva en `legacy/` y en el historial de `main`.

## Requisitos y ejecución local

- Node.js compatible con el campo `engines` de `package.json` y npm.
- `npm install`: instala las dependencias.
- `npm run dev`: inicia el servidor local de Vite.
- `npm run build`: genera la versión de producción en `dist/`.
- `npm run preview`: permite revisar localmente el resultado del build.

## Estructura actual

- `src/`: punto de entrada Vue, componente raíz, router y configuración pública del negocio.
- `public/data.json`: catálogo de siete productos, disponible como archivo público para Fetch.
- `public/images/`: logo y fotografías.
- `legacy/`: código HTML, CSS y JavaScript del Avance 2, conservado como referencia de migración.
- `netlify.toml` y `public/_redirects`: configuración de build y rutas SPA para Netlify.

## Alcance de la migración

La navegación y las vistas base ya usan Vue Router, con carga diferida, título por ruta, página 404 y transición adaptable a movimiento reducido. El catálogo y los filtros ya usan un store de Pinia; Categorías, Productos y el detalle por ID muestran datos de `public/data.json`, con estados de carga, error y reintento. Los perfiles locales y el carrito ya usan stores de Pinia y conservan los datos por perfil en `localStorage`. El formulario de contacto también usa Vue y un store de Pinia: valida los campos al editarlos y conserva el borrador y las consultas en `localStorage`. El estado compartido se divide en los stores de catálogo, carrito, perfil y consultas. Los perfiles son demostrativos y los datos guardados en el navegador no constituyen autenticación ni envío a un servidor.

La configuración pública del negocio está en `src/config/negocio.js`. La dirección permanece vacía hasta su confirmación. El enlace a WhatsApp abre una conversación; el bot se desarrollará aparte.

## Producción

URL de producción: https://modoshake.netlify.app. Durante esta fase, la URL puede seguir mostrando la versión anterior hasta que se revise y publique la aplicación Vue.