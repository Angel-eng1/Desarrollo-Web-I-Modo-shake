# Modo Shake — Desarrollo Web I

Aplicación frontend académica para presentar los productos de Modo Shake, en Sahagún, Córdoba. El proyecto reúne el trabajo del primer avance (estructura HTML y diseño adaptable) y del segundo avance (interactividad con JavaScript nativo).

## Funciones del avance 2

- Catálogo de siete productos leído desde `data.json` con Fetch y `async/await`. Muestra estados de carga, error y reintento.
- Búsqueda por nombre y filtros por categoría que actualizan las tarjetas sin recargar la página.
- Vistas de Inicio, Categorías, Productos, Carrito, Perfil, Nosotros y Contacto, con enlaces que permiten usar Atrás y Adelante.
- Carrito para agregar y quitar productos, cambiar cantidades y calcular el total. La selección se conserva en `localStorage` tras recargar.
- Formulario con validación inmediata, mensajes junto a cada campo y comprobación de la fecha. El borrador y las consultas válidas se guardan en `localStorage`, donde se pueden revisar o eliminar.

El total de los suplementos es estimado porque su precio depende de la cantidad. El carrito no procesa pagos ni pedidos. Las consultas se guardan solo en el navegador utilizado; no se envían al restaurante ni a un servidor.

## Cómo abrir el proyecto

1. Abre esta carpeta en Visual Studio Code.
2. Abre `index.html` con **Live Server**.
3. En la página que se abre, entra a **Categorías** o **Productos** para consultar los datos.

Se necesita un servidor HTTP local para que Fetch pueda leer `data.json`; abrir el archivo HTML directamente con doble clic puede impedir la carga. Las tipografías de Google Fonts y los iconos de Bootstrap Icons necesitan conexión a Internet porque se enlazan desde sus CDN.

## Organización de archivos

- `index.html`: estructura semántica, navegación, tarjetas generadas y formulario.
- `styles.css`: colores, distribución con Grid y Flexbox, vistas adaptables y animaciones.
- `app.js`: lógica de catálogo, filtros, carrito, navegación y formulario, dividida en bloques comentados.
- `data.json`: información de los siete productos.
- `images/`: fotografías del logo y los productos.
- `docs/informe-avance-2.md`: informe académico del segundo avance.

## Cómo comprobar las funciones

- Filtra una categoría y escribe un nombre en el buscador; usa **Limpiar filtros** para volver a todos los productos.
- Agrega productos al carrito, cambia una cantidad y recarga la página. La selección y el total deben conservarse.
- En Contacto, intenta guardar campos vacíos o incorrectos para ver los mensajes. Escribe un borrador y recarga para comprobar que vuelve a aparecer. Completa una consulta válida, recarga y elimínala desde la lista.

## Desarrollo académico

El primer avance cubrió HTML5 semántico, formulario con atributos nativos, diseño adaptable y recursos externos. Este segundo avance incorpora manipulación del DOM, eventos, carga asíncrona de datos, manejo de errores, validaciones dinámicas y persistencia local. La entrega final de la guía prevé migrar la aplicación a Vue.js y publicarla.

## Perfiles locales de demostración

El icono de perfil del encabezado permite crear un perfil con nombre y correo o volver a entrar con un correo previamente registrado en este mismo navegador. Antes de agregar un producto se solicita un perfil; cada perfil conserva su propio carrito local. Cerrar sesión oculta el carrito del perfil activo; al volver a entrar se recupera. También puedes eliminar el perfil local y su carrito desde la vista Perfil.

Esta función demuestra el flujo de registro e ingreso en el cliente. No usa contraseñas ni verifica identidades, por lo que no representa una cuenta segura ni funciona entre dispositivos. Los perfiles y carritos quedan guardados únicamente en localStorage.

## Mejoras de interfaz

- El encabezado permanece visible al desplazarse, marca la vista activa y ofrece un menú accesible hasta 900 px. El menú se cierra con Escape o al elegir un enlace.
- La portada presenta una fotografía, beneficios breves y el enlace principal «Ver categorías». Las tarjetas mantienen una proporción uniforme y la búsqueda ofrece filtros desplazables, estado vacío y carga visual.
- El carrito muestra un resumen y un aviso acorde con la configuración de WhatsApp.
- Nosotros y Contacto presentan la información en bloques legibles; el formulario muestra ayudas y permite revisar las consultas locales en un panel plegable.
- Las imágenes usan nombres en minúsculas con guiones (por ejemplo, `images/logo-modoshake.jpg` y `images/batido-fresa.jpg`). El sitio incluye favicon y etiquetas para compartir.

## Datos del negocio por completar

Al comienzo de `app.js` está `CONFIG_NEGOCIO`. Ya incluye el WhatsApp, Instagram, TikTok y los horarios proporcionados para este proyecto:

- `whatsapp`: `573218794687`. El botón flotante abre una conversación directa y el carrito permite preparar una consulta con su resumen. Ninguno procesa pagos.
- `instagram`: `modoshake` ([perfil](https://www.instagram.com/modoshake/)).
- `tiktok`: `modoshake` ([perfil](https://www.tiktok.com/@modoshake)).
- `horario`: lunes a viernes, 8:00 a. m. a 10:30 a. m. y 3:00 p. m. a 9:00 p. m.; sábados y domingos, 4:00 p. m. a 8:30 p. m.; festivos sin servicio.
- `direccion`: pendiente de confirmación; se mostrará en Contacto y el pie cuando se complete.

La ciudad Sahagún, Córdoba se muestra aunque la dirección esté vacía. En ese caso, Contacto y el pie ofrecen un enlace de WhatsApp para preguntar cómo llegar, sin mostrar mapa ni dirección. El botón de WhatsApp solo abre el chat; para respuestas automáticas se necesitará configurar aparte un servicio de bot con la plataforma de WhatsApp y su servidor. No se colocan claves de API en este frontend.

Las etiquetas `og:image` y `twitter:image` apuntan a `https://modoshake.netlify.app/images/logo-modoshake.jpg`; la imagen debe estar publicada allí para que se vea al compartir el sitio. Los precios y la disponibilidad deben validarse con el negocio antes de publicar.


## Ajustes de presentación

- Las fotos de productos y categorías mantienen las proporciones 4:3 y 16:10 en los tamaños revisados. La portada conserva su tratamiento visual.
- Hasta 900 px, el encabezado queda en una fila y el menú se despliega debajo. El enlace principal a Categorías está en la portada; el pie ofrece otro acceso.
- Los enlaces a secciones tienen espacio respecto al encabezado fijo. El pie deja espacio para el botón flotante de WhatsApp.
- Instagram y TikTok muestran su nombre junto al icono. Los metadatos para compartir usan la URL pública indicada arriba.
