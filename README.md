# Modo Shake

Aplicación web de Modo Shake, desarrollada como proyecto de Desarrollo Web I. Permite explorar el catálogo, consultar productos, guardar una selección en el carrito y usar un formulario de contacto de demostración. Está construida como una aplicación de una sola página con Vue 3, Vite, Vue Router y Pinia.

**Sitio publicado:** [modoshake.netlify.app](https://modoshake.netlify.app)

## Requisitos

- Node.js `^22.18.0` o `>=24.12.0` y npm. Se recomienda Node.js 24, la versión usada en Netlify.
- Conexión a Internet para cargar Google Fonts, Bootstrap Icons y las publicaciones incrustadas de Instagram.

## Instalación y ejecución local

```bash
git clone https://github.com/Angel-eng1/Desarrollo-Web-I-Modo-shake.git
cd Desarrollo-Web-I-Modo-shake
npm ci
npm run dev
```

Abre en el navegador la dirección que muestre Vite en la terminal, normalmente `http://localhost:5173/`. La aplicación debe ejecutarse mediante Vite; abrir `index.html` directamente como archivo no carga el proyecto.

La aplicación funciona sin configurar Firebase: se pueden crear perfiles locales de demostración, explorar el catálogo y probar el carrito y el formulario.

## Acceso con Google en local (opcional)

Para probar el acceso con Google se necesita un proyecto propio de Firebase con una aplicación web registrada:

1. En Firebase Authentication, habilita el proveedor **Google** y autoriza `localhost` en **Settings > Authorized domains**.
2. Copia `.env.example` a `.env.local` en la raíz del proyecto.
3. Completa en `.env.local` los cuatro valores de la configuración web de Firebase:

   ```dotenv
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_APP_ID=
   ```

4. Reinicia `npm run dev` y prueba **Continuar con Google** en la página Perfil.

`.env.local` no se incluye en Git. Las variables `VITE_*` se incorporan al código del navegador: usa solo la configuración web de Firebase, nunca claves privadas ni secretos de servidor. Si faltan los valores, el botón de Google queda desactivado durante el desarrollo; los perfiles locales siguen disponibles.

## Pruebas y compilación

```bash
npm test
npm run build
npm run preview
```

`npm test` comprueba el catálogo, la persistencia local y la separación de carritos por perfil. `npm run build` genera la versión de producción en `dist/`; ejecuta `npm run preview` después del build para revisarla localmente. El servidor de desarrollo se detiene con `Ctrl+C`.

## Funciones principales

- Rutas de Inicio, Categorías, Productos, detalle de producto, Carrito, Perfil, Nosotros y Contacto, además de una página 404.
- Catálogo cargado desde `public/data.json` con Fetch, estados de carga y error, y opción de reintento. Incluye filtros por categoría y búsqueda por nombre.
- Carrito por perfil con cantidades y total, guardado en `localStorage`. Requiere un perfil activo para añadir productos.
- Perfiles locales de demostración y acceso con Google mediante Firebase Authentication cuando está configurado.
- Formulario de contacto con validación inmediata, borrador y consultas guardadas en el navegador.
- Diseño adaptable, navegación con teclado, menú móvil y galería de publicaciones de Instagram en la página de inicio.
- Enlaces a WhatsApp para consultar productos, pedir indicaciones o iniciar una conversación.

Los perfiles locales no tienen contraseña ni verifican la identidad. El carrito y las consultas se guardan solo en el navegador y no se sincronizan entre dispositivos. El formulario no envía información al restaurante y el carrito no procesa pagos. El botón de WhatsApp abre el chat; no incluye un bot.

## Estructura del proyecto

| Ruta | Contenido |
| --- | --- |
| `src/views/` | Páginas de la aplicación. |
| `src/components/` | Elementos reutilizables de la interfaz. |
| `src/stores/` | Estado compartido de catálogo, carrito, perfil y consultas con Pinia. |
| `src/router/` | Rutas, carga diferida de vistas y títulos de página. |
| `src/config/` | Datos del negocio y configuración opcional de Firebase. |
| `src/assets/main.css` | Estilos y reglas para distintos tamaños de pantalla. |
| `public/data.json`, `public/images/` | Productos e imágenes locales. |
| `tests/` | Pruebas automatizadas de los flujos locales. |
| `legacy/` | Código anterior conservado como referencia de la migración a Vue. |
| `netlify.toml`, `public/_redirects` | Build y redirección de rutas para Netlify. |

## Comprobación manual rápida

1. Abre Categorías y Productos; prueba el filtro, la búsqueda y el detalle de un producto.
2. Crea un perfil local, añade un producto al carrito, cambia la cantidad y recarga la página para comprobar que se conserva.
3. En Contacto, completa un borrador, recarga la página y comprueba que los datos siguen allí. Guarda una consulta y elimínala.
4. Abre una ruta directamente o recárgala para comprobar la navegación. Revisa también el menú en una pantalla móvil.

## Datos del negocio y despliegue

WhatsApp: **+57 321 879 4687**. Instagram y TikTok: **@modoshake**. Los horarios se definen en `src/config/negocio.js`. La dirección permanece vacía hasta que el negocio la confirme; la aplicación ofrece WhatsApp para preguntar cómo llegar.

La versión publicada está en [Netlify](https://modoshake.netlify.app). El proyecto se compila con `npm run build` y se publica desde `dist/`. Para habilitar Google en otro despliegue, configura allí las mismas cuatro variables `VITE_FIREBASE_*`, autoriza el dominio en Firebase Authentication y genera un nuevo build.
