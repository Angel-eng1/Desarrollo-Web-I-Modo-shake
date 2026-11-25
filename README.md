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
- Filtros por categoría y búsqueda por nombre. El detalle consulta el producto por ID, presenta su precio y foto, ofrece consulta por WhatsApp y sugiere otros productos del catálogo; muestra un mensaje si el ID no existe.
- Perfiles locales de demostración. Cada perfil conserva su propio carrito en `localStorage`; para agregar un producto se requiere un perfil activo.
- Acceso y registro con Google mediante Firebase Authentication cuando se configura un proyecto Firebase. El primer acceso crea la cuenta; los siguientes recuperan la misma identidad. El carrito de una cuenta Google se separa del de un perfil local, incluso si usan el mismo correo.
- Carrito con cantidades, total, eliminación y enlace para consultar la selección por WhatsApp. Los suplementos se muestran con precio estimado.
- Formulario de contacto con validación inmediata, borrador recuperable y consultas que se pueden revisar o eliminar. Los datos se guardan solo en el navegador.
- Menú adaptable, navegación con teclado, mensajes accesibles, transiciones que respetan la preferencia de movimiento reducido y botón flotante de WhatsApp.
- Galería de cuatro fotos del catálogo en la página de inicio, enlazadas a sus productos. El carrusel de Instagram presenta tres Reels y dos publicaciones de fotos de `@modoshake`; permite avanzar, retroceder o elegir una publicación, con enlace a cada original.

Los perfiles locales no verifican identidades ni tienen contraseñas; el acceso Google sí usa Firebase Authentication. Los carritos de ambos modos permanecen en el navegador y no se sincronizan entre dispositivos. El carrito no procesa pagos y el formulario no envía consultas al restaurante ni a un servidor. El botón de WhatsApp abre el chat; un bot necesitaría un servicio configurado aparte.

## Activar el acceso con Google

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/) y registrar una aplicación web.
2. En **Authentication > Sign-in method**, habilitar **Google**. En **Settings > Authorized domains**, agregar `modoshake.netlify.app` y `localhost` para las pruebas locales.
3. Copiar `.env.example` como `.env.local` y completar sus cuatro valores `VITE_FIREBASE_*` con la configuración web de Firebase. Reiniciar `npm run dev` y abrir la dirección `localhost` que muestra Vite.
4. Para publicar este acceso, configurar las mismas cuatro variables de entorno en Netlify y hacer un nuevo despliegue. La configuración web no contiene un secreto de servidor; no añadir claves privadas ni secretos OAuth a variables `VITE_*`.

Si falta esa configuración, el botón se muestra desactivado durante el desarrollo y se oculta en la versión publicada. Los perfiles locales siguen disponibles. El acceso real con Google requiere completar los pasos anteriores y probarlo con una cuenta Google.

## Estructura

- `src/views/`: páginas asociadas a las rutas.
- `src/components/`: encabezado, pie, tarjetas, filtros y elementos compartidos.
- `src/stores/`: estado de catálogo, carrito, perfil y consultas mediante Pinia.
- `src/router/`: rutas de Vue Router, carga diferida y títulos.
- `src/config/negocio.js`: WhatsApp, redes, horarios y dirección del negocio.
- `src/config/firebase.js` y `.env.example`: conexión opcional con Firebase Authentication.
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

URL de producción: [modoshake.netlify.app](https://modoshake.netlify.app). Netlify usa Node.js 24, construye con `npm run build` y publica `dist`; estos valores están en `netlify.toml`.
