# Modo Shake — Desarrollo Web I

Aplicación web académica para presentar el catálogo de Modo Shake, en Sahagún, Córdoba. Reúne la estructura y el diseño adaptable del primer avance con la interactividad del segundo avance, desarrollada con HTML, CSS y JavaScript nativo.

## Funcionalidades

- Catálogo de siete productos cargado desde `data.json` mediante Fetch y `async/await`, con indicador de carga, mensaje de error y reintento.
- Búsqueda por nombre y filtros por categoría sin recargar la página.
- Navegación entre Inicio, Categorías, Productos, Carrito, Perfil, Nosotros y Contacto, compatible con Atrás y Adelante.
- Carrito con selección de productos, cambio de cantidades y cálculo del total. Cada perfil local conserva su carrito en `localStorage`.
- Perfiles de demostración con nombre y correo. Se requiere un perfil activo para agregar productos al carrito.
- Formulario de contacto con validación inmediata. El borrador y las consultas válidas se conservan en `localStorage`.
- Enlaces a Instagram, TikTok y WhatsApp, incluido un botón flotante para abrir una conversación.

Los suplementos tienen un precio estimado porque su valor depende de la cantidad. El carrito no procesa pagos. Las consultas no se envían al restaurante ni a un servidor: se guardan solo en el navegador utilizado. Los perfiles no tienen contraseñas ni verificación de identidad y no funcionan entre dispositivos.

## Ejecución local

El proyecto puede abrirse en Visual Studio Code y ejecutarse con **Live Server** desde `index.html`. También puede utilizarse cualquier servidor HTTP local que entregue los archivos de esta carpeta. Fetch necesita ese servidor para leer `data.json`; abrir el HTML directamente como archivo local puede impedir la carga del catálogo.

Google Fonts y Bootstrap Icons se enlazan desde sus CDN y requieren conexión a Internet.

## Estructura del proyecto

- `index.html`: estructura semántica, vistas y formulario.
- `styles.css`: identidad visual, distribución con Grid y Flexbox, diseño adaptable y animaciones.
- `app.js`: configuración del negocio y lógica de navegación, catálogo, filtros, carrito, perfiles y formulario.
- `data.json`: datos de los siete productos del catálogo.
- `images/`: logo y fotografías de productos.

## Comprobación de funciones

Con el proyecto abierto mediante un servidor HTTP local, estos recorridos permiten comprobar sus funciones:

1. Seleccionar una categoría, buscar un producto por nombre y utilizar **Limpiar filtros** para mostrar de nuevo el catálogo completo.
2. Crear un perfil local, agregar productos al carrito, modificar una cantidad y recargar la página para comprobar la recuperación del carrito y su total.
3. Introducir valores incorrectos en el formulario para observar los mensajes de validación. Guardar un borrador, recargar, registrar una consulta válida y eliminarla desde la lista de consultas locales.
4. Abrir los enlaces de redes sociales y el botón flotante de WhatsApp.

## Interfaz y accesibilidad

El sitio usa HTML5 semántico y un diseño adaptable para móvil, tablet y escritorio. El encabezado permanece visible durante el desplazamiento y contiene el acceso **Ver categorías**, el carrito y el perfil. La portada ofrece otro acceso a las categorías. Hasta 900 px, la navegación se presenta en un menú que puede cerrarse con Escape o al seleccionar un enlace. En pantallas de 600 px o menos se oculta el botón del encabezado para conservar una sola fila.

Las tarjetas de productos y categorías mantienen proporciones de imagen uniformes. El formulario muestra ayudas junto a los campos; el pie reserva espacio para que el botón flotante de WhatsApp no cubra su contenido. Las imágenes usan nombres en minúsculas con guiones, como `images/logo-modoshake.jpg` y `images/batido-fresa.jpg`. El proyecto incluye favicon y metadatos para compartir enlaces.

## Datos del negocio

La constante `CONFIG_NEGOCIO`, al comienzo de `app.js`, reúne la información mostrada en Contacto y en el pie:

- WhatsApp: **+57 321 879 4687**. El botón flotante abre el chat y el carrito puede preparar un mensaje con el resumen del pedido.
- Instagram: [@modoshake](https://www.instagram.com/modoshake/).
- TikTok: [@modoshake](https://www.tiktok.com/@modoshake).
- Horario: lunes a viernes, de 8:00 a. m. a 10:30 a. m. y de 3:00 p. m. a 9:00 p. m.; sábados y domingos, de 4:00 p. m. a 8:30 p. m.; festivos sin servicio.
- Dirección: pendiente de confirmación. Mientras este campo permanezca vacío, el sitio muestra Sahagún, Córdoba y ofrece WhatsApp para consultar cómo llegar, sin presentar un mapa ni una dirección.

El botón de WhatsApp abre una conversación; las respuestas automáticas requieren un servicio de bot configurado por separado. El frontend no contiene claves de API. Las etiquetas `og:image` y `twitter:image` usan la URL `https://modoshake.netlify.app/images/logo-modoshake.jpg`, cuya imagen debe estar disponible en esa dirección para aparecer al compartir el sitio.

## Contexto académico

El primer avance comprendió HTML5 semántico, validación nativa del formulario y diseño adaptable. El segundo avance incorpora manipulación del DOM, gestión de eventos, carga asíncrona de datos, manejo de errores, validaciones dinámicas y persistencia local. La guía del curso prevé una migración a Vue.js en la entrega final.
