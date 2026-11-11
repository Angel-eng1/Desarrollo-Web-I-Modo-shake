# Modo Shake — Desarrollo Web I

Aplicación frontend académica para presentar los productos de Modo Shake, en Sahagún, Córdoba. El proyecto reúne el trabajo del primer avance (estructura HTML y diseño adaptable) y del segundo avance (interactividad con JavaScript nativo).

## Funciones del avance 2

- Catálogo de siete productos leído desde `data.json` con Fetch y `async/await`. Muestra estados de carga, error y reintento.
- Búsqueda por nombre y filtros por categoría que actualizan las tarjetas sin recargar la página.
- Vistas de Inicio, Catálogo, Productos, Carrito, Nosotros y Contacto, con enlaces que permiten usar Atrás y Adelante.
- Carrito para agregar y quitar productos, cambiar cantidades y calcular el total. La selección se conserva en `localStorage` tras recargar.
- Formulario con validación inmediata, mensajes junto a cada campo y comprobación de la fecha. El borrador y las consultas válidas se guardan en `localStorage`, donde se pueden revisar o eliminar.

El total de los suplementos es estimado porque su precio depende de la cantidad. El carrito no procesa pagos ni pedidos. Las consultas se guardan solo en el navegador utilizado; no se envían al restaurante ni a un servidor.

## Cómo abrir el proyecto

1. Abre esta carpeta en Visual Studio Code.
2. Abre `index.html` con **Live Server**.
3. En la página que se abre, entra a **Catálogo** o **Productos** para consultar los datos.

Se necesita un servidor HTTP local para que Fetch pueda leer `data.json`; abrir el archivo HTML directamente con doble clic puede impedir la carga. Las tipografías de Google Fonts y los iconos de Bootstrap Icons necesitan conexión a Internet porque se enlazan desde sus CDN.

## Organización de archivos

- `index.html`: estructura semántica, navegación, tarjetas generadas y formulario.
- `styles.css`: colores, distribución con Grid y Flexbox, vistas adaptables y animaciones.
- `app.js`: lógica de catálogo, filtros, carrito, navegación y formulario, dividida en bloques comentados.
- `data.json`: información de los siete productos.
- `images/`: fotografías del logo y los productos.

## Cómo comprobar las funciones

- Filtra una categoría y escribe un nombre en el buscador; usa **Limpiar filtros** para volver a todos los productos.
- Agrega productos al carrito, cambia una cantidad y recarga la página. La selección y el total deben conservarse.
- En Contacto, intenta guardar campos vacíos o incorrectos para ver los mensajes. Escribe un borrador y recarga para comprobar que vuelve a aparecer. Completa una consulta válida, recarga y elimínala desde la lista.

## Desarrollo académico

El primer avance cubrió HTML5 semántico, formulario con atributos nativos, diseño adaptable y recursos externos. Este segundo avance incorpora manipulación del DOM, eventos, carga asíncrona de datos, manejo de errores, validaciones dinámicas y persistencia local. La entrega final de la guía prevé migrar la aplicación a Vue.js y publicarla.
