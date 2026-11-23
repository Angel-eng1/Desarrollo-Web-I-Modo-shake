# Modo Shake — Desarrollo Web I

Aplicación web académica para presentar los productos de Modo Shake en Sahagún, Córdoba. La entrega final es una SPA desarrollada con Vue 3, Vite, Vue Router y Pinia.

## Ejecutar el proyecto

Requiere Node.js compatible con el campo `engines` de `package.json` y npm.

```bash
npm install
npm run dev
```

Vite muestra la dirección local en la terminal. Para comprobar la compilación de producción:

```bash
npm run build
npm run preview
npm test
```

El build se genera en `dist/`. `npm test` ejecuta pruebas del catálogo (200, 404, 500 y reintento), así como de persistencia y separación de datos entre perfiles, con el ejecutor incluido en Node.js. Las tipografías de Google Fonts y Bootstrap Icons se enlazan desde CDN y requieren conexión a Internet.

## Funciones

- Navegación SPA con vistas de Inicio, Categorías, Productos, detalle, Carrito, Perfil, Nosotros y Contacto, además de una ruta 404. Las vistas se cargan al visitarlas.
- Catálogo de siete productos obtenido con Fetch desde `public/data.json`, con indicador de carga, manejo de errores y reintento.
- Filtros por categoría y búsqueda por nombre. El detalle consulta el producto por ID y muestra un mensaje si no existe.
- Perfiles locales de demostración. Cada perfil conserva su propio carrito en `localStorage`; para agregar un producto se requiere un perfil activo.
- Carrito con cantidades, total, eliminación y enlace para consultar la selección por WhatsApp. Los suplementos se muestran con precio estimado.
- Formulario de contacto con validación inmediata, borrador recuperable y consultas que se pueden revisar o eliminar. Los datos se guardan solo en el navegador.
- Menú adaptable, navegación con teclado, mensajes accesibles, transiciones que respetan la preferencia de movimiento reducido y botón flotante de WhatsApp.

Los perfiles no verifican identidades ni tienen contraseñas. El carrito no procesa pagos y el formulario no envía consultas al restaurante ni a un servidor. El botón de WhatsApp abre el chat; un bot necesitaría un servicio configurado aparte.

## Estructura

- `src/views/`: páginas asociadas a las rutas.
- `src/components/`: encabezado, pie, tarjetas, filtros y elementos compartidos.
- `src/stores/`: estado de catálogo, carrito, perfil y consultas mediante Pinia.
- `src/router/`: rutas de Vue Router, carga diferida y títulos.
- `src/config/negocio.js`: WhatsApp, redes, horarios y dirección del negocio.
- `src/assets/main.css`: estilos adaptables.
- `public/data.json` y `public/images/`: catálogo e imágenes.
- `legacy/`: código del Avance 2 conservado como referencia de migración.
- `netlify.toml` y `public/_redirects`: build y redirección de rutas para Netlify.
- `tests/`: pruebas de los flujos locales de perfiles, carrito y consultas.

## Comprobación local

1. Abrir Categorías, elegir una categoría y comprobar el filtro en Productos. Usar la búsqueda y **Limpiar filtros**.
2. Abrir un detalle de producto y probar una URL con un ID inexistente.
3. Agregar un producto sin perfil, crear un perfil local y comprobar que el producto pendiente llega al carrito.
4. Cambiar la cantidad, recargar, cerrar sesión y volver a entrar para comprobar la recuperación del carrito de ese perfil.
5. En Contacto, intentar guardar campos vacíos, completar un borrador y recargar. Después guardar y eliminar una consulta local.
6. Revisar el menú móvil, las rutas al recargar y el diseño a 360, 768 y 1280 px.

## Datos del negocio y publicación

El WhatsApp configurado es **+57 321 879 4687**; Instagram y TikTok usan **@modoshake**. Los horarios están en `src/config/negocio.js`. La dirección permanece vacía hasta que el negocio la confirme; el sitio ofrece WhatsApp para preguntar cómo llegar y no muestra un mapa.

URL de producción: [modoshake.netlify.app](https://modoshake.netlify.app). Netlify debe usar Node.js 24, construir con `npm run build` y publicar `dist`; estos valores están en `netlify.toml`. La URL puede mostrar la versión anterior hasta que se despliegue esta rama Vue.
