# Informe del segundo avance — Modo Shake

## 1. Portada y datos

**Institución:** Universidad de Córdoba  
**Programa:** Ingeniería de Sistemas y Telemática  
**Curso:** Desarrollo Web I  
**Entrega:** Avance 2  
**Proyecto:** Sitio web de Modo Shake  
**Estudiante:** [Nombre del estudiante]  
**Fecha de entrega:** 13 de noviembre de 2026

## 2. Introducción

Modo Shake es un negocio de alimentos ubicado en Sahagún, Córdoba. En este proyecto presentamos sus categorías y siete productos mediante una aplicación web que permite consultar el catálogo y preparar una selección en el navegador. El primer avance estableció la estructura y el diseño adaptable. En el segundo incorporamos JavaScript nativo para cargar los productos, responder a las acciones del usuario, validar el formulario y conservar datos locales entre visitas.

El sitio facilita explorar opciones por categoría y nombre, revisar un total estimado y consultar al negocio por WhatsApp. También permite guardar consultas en el dispositivo desde el que se usa. Estas funciones forman un prototipo académico: no constituyen una tienda con pagos ni un servicio que envíe automáticamente formularios al restaurante.

## 3. Objetivo del avance

Nuestro objetivo es convertir la maqueta del primer avance en una interfaz interactiva. Para ello usamos manipulación del DOM y eventos, una solicitud asíncrona a `data.json`, validaciones durante la escritura y almacenamiento local. Conservamos la navegación entre vistas y el diseño adaptable sin incorporar bibliotecas nuevas.

## 4. Descripción del proyecto y de los archivos

Organizamos el sitio en vistas de Inicio, Categorías, Productos, Carrito, Perfil, Nosotros y Contacto. El archivo `index.html` contiene la estructura semántica, los controles, el formulario y los contenedores que JavaScript actualiza. `styles.css` define colores, tipografía, tarjetas, estados visuales y reglas para distintos anchos de pantalla. `app.js` reúne la lógica de perfiles, carrito, catálogo, navegación y formulario. `data.json` contiene los siete productos con identificador, nombre, descripción, precio, categoría, ruta de imagen, texto alternativo e indicador de precio «desde». Las fotografías y el logo están en `images/`.

Abrimos el proyecto mediante un servidor HTTP local, por ejemplo Live Server, porque la solicitud Fetch de `data.json` puede fallar si se abre `index.html` directamente como archivo. Las fuentes de Google Fonts y los iconos de Bootstrap Icons se enlazan desde sus CDN; no instalamos una biblioteca de componentes.

## 5. Cumplimiento de los requisitos

### 5.1. Manipulación del DOM y eventos

En `app.js`, `crearTarjeta(producto)` construye cada tarjeta con `document.createElement` y coloca nombre, categoría, descripción y precio mediante `textContent`. `actualizarCatalogo()` reemplaza las tarjetas visibles con `replaceChildren` después de aplicar los filtros. En `Carrito.mostrar()` creamos filas, controles de cantidad y botones para eliminar productos; al cambiar una cantidad actualizamos el subtotal, el total y la insignia del encabezado. `mostrarConsultas()` crea la lista de consultas guardadas y la vuelve a dibujar cuando se elimina una.

Usamos `click` en categorías, botones del carrito, navegación y menú; `input` en el buscador y los campos del formulario; `change` en la cantidad del carrito y en los campos que admiten ese evento; y `submit` en los formularios de perfil y contacto. En los envíos y en ciertos enlaces internos aplicamos `preventDefault()` para controlar el comportamiento desde JavaScript. El menú conserva `aria-expanded`, se cierra al elegir un enlace y responde a la tecla Escape.

### 5.2. Consumo asíncrono de datos

La función `cargarCatalogo()` de `app.js` es `async` y usa `await fetch("./data.json")`. Una respuesta satisfactoria, como HTTP 200, permite leer el JSON y pasarlo por `validarProductos()`, que comprueba la estructura de los registros antes de mostrarlos. No tratamos una respuesta 404 como un catálogo vacío: presentamos un mensaje específico. Para estados 500 o superiores mostramos un error de servidor; otros estados no satisfactorios también producen un mensaje.

Antes de la solicitud deshabilitamos los filtros, indicamos que el listado está ocupado y mostramos tres tarjetas de carga. `try/catch/finally` separa la carga correcta, los errores de red o de lectura y la limpieza final del estado ocupado. Si ocurre un error, conservamos el mensaje y habilitamos «Reintentar», cuyo evento vuelve a ejecutar `cargarCatalogo()`. Una búsqueda sin coincidencias presenta un estado vacío distinto de un error de carga.

### 5.3. Persistencia con localStorage

En el módulo `Perfiles`, las funciones `leer()` y `guardar()` conservan los perfiles de demostración y el correo del perfil activo. En el módulo `Carrito`, `guardar()` almacena los identificadores y cantidades elegidos bajo una clave asociada al correo local; `recuperar()` reconstruye la selección al cargar el catálogo y descarta entradas inválidas o productos que ya no estén en `data.json`. El catálogo completo se lee del archivo JSON y no se guarda en `localStorage`.

Para Contacto, `guardarBorrador()` conserva los valores mientras se escribe. `leerLocal()`, `guardarLocal()` y `borrarLocal()` gestionan el borrador y las consultas válidas. Al recargar, restituimos el borrador y dibujamos las consultas guardadas. El usuario puede eliminar una consulta desde la lista. Las operaciones de almacenamiento están dentro de `try/catch` para informar cuando el navegador no permite guardar o leer datos.

### 5.4. Validaciones dinámicas

El formulario de `index.html` define campos obligatorios, correo electrónico, longitud mínima, patrón de diez dígitos para el teléfono y límites para el número de personas. En `app.js`, `mensajeCampo(campo)` interpreta `campo.validity` y comprueba que la fecha no sea anterior al día local. `validarCampo(campo)` muestra el mensaje junto al control y actualiza `aria-invalid`.

Registramos eventos `input` y `change` para ofrecer retroalimentación durante la edición y guardar el borrador. En el evento `submit` de `formularioContacto` evitamos el envío normal, validamos todos los campos y enfocamos el primero que necesita corrección. Solo si son válidos guardamos una consulta local y limpiamos el formulario. `styles.css` diferencia visualmente los bordes de error y los campos válidos; los avisos están vinculados a los controles mediante `aria-describedby`.

## 6. Funciones adicionales

Además de los requisitos del avance, incorporamos perfiles locales para mostrar un flujo de registro e ingreso. `Perfiles.solicitarRegistro()` lleva a la vista Perfil cuando alguien intenta agregar un producto sin perfil activo; después de registrarse o entrar, recuperamos esa acción pendiente. Cada perfil conserva su propia selección local. Es una demostración sin contraseñas ni verificación de identidad.

Incluimos un botón flotante que abre WhatsApp mediante `wa.me` y, cuando el carrito tiene productos, un enlace con el resumen codificado mediante `encodeURIComponent`. Los enlaces del negocio se construyen desde `CONFIG_NEGOCIO`; la dirección permanece vacía y ofrecemos preguntar cómo llegar por WhatsApp, sin mapa. `styles.css` usa Grid, Flexbox y media queries; el encabezado cambia a menú compacto hasta 900 px. También usamos etiquetas semánticas, enlace para saltar al contenido, nombres accesibles, estados anunciados y reducción de movimiento según la preferencia del usuario. Presentamos estas funciones como complementarias, no como requisitos de la guía.

## 7. Decisiones de diseño y seguridad

Creamos el texto de productos, perfiles, carrito y consultas con `textContent`, en vez de insertar contenido escrito por el usuario como HTML. Validamos la forma de los productos recibidos del JSON antes de dibujar las tarjetas. Al separar `data.json` de `app.js`, podemos cambiar el catálogo sin reescribir las funciones de filtrado y presentación.

El almacenamiento local tiene límites: depende del navegador y del dispositivo, puede borrarse y no ofrece una identidad confiable. Por eso no pedimos contraseñas ni presentamos los perfiles como cuentas seguras. Las consultas quedan en ese navegador y no llegan al restaurante. El carrito calcula importes para consulta, pero no confirma existencias, pedidos ni pagos; el precio de los suplementos se muestra como estimado.

## 8. Pruebas realizadas

Para reproducir la revisión, abrimos la carpeta con Live Server y seguimos estos pasos:

1. Entramos en Productos, elegimos una categoría, escribimos un nombre y usamos «Limpiar filtros» para recuperar el listado completo.
2. Probamos una búsqueda sin coincidencias y comprobamos que aparece el estado vacío.
3. Intentamos agregar un producto sin perfil; registramos un perfil local de prueba y comprobamos que la selección aparece en el carrito.
4. Cambiamos la cantidad, revisamos el total y recargamos para comprobar la recuperación desde `localStorage`. Revisamos también el enlace de consulta por WhatsApp sin enviar un mensaje.
5. En Contacto, intentamos guardar datos vacíos o incorrectos, completamos una consulta válida y la eliminamos de la lista local. También comprobamos la recuperación del borrador tras recargar.
6. Revisamos las vistas a 360, 768 y 1280 px para detectar desplazamiento horizontal; probamos el menú compacto y su cierre con Escape. Revisamos la consola del navegador durante estas comprobaciones.

Evidencias para incorporar a la entrega: [Capturas].

## 9. Limitaciones y trabajo futuro

El formulario aún no envía información a un servidor. Los perfiles y el carrito dependen de `localStorage`, por lo que no se comparten entre dispositivos. El botón de WhatsApp abre una conversación, pero no incluye un bot; esa integración requiere un servicio separado. No mostramos una dirección ni un mapa porque el dato no se ha confirmado. Antes de publicar, debemos comprobar la disponibilidad de la imagen usada en los metadatos para compartir y validar precios y productos con el negocio. Como trabajo posterior, la guía prevé migrar la aplicación a Vue.js.

## 10. Conclusiones

En este avance conectamos la presentación visual con datos cargados de forma asíncrona y con acciones que modifican el DOM. La búsqueda, el carrito y el formulario permiten observar eventos, validaciones y persistencia en un caso concreto. Mantuvimos explícitos los límites del prototipo: las consultas y perfiles siguen siendo locales y el sitio no procesa pedidos. Esta base permite continuar el desarrollo sin atribuir al frontend funciones de un backend inexistente.

## 11. Enlaces

- Repositorio: [Enlace del repositorio]
- Producción: [URL publicada en Netlify]
