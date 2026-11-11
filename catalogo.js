// defer permite ejecutar este archivo después de que se haya leído el HTML.
const contenedorProductos = document.querySelector("#productos");
const estadoCatalogo = document.querySelector("#estado-catalogo");
const botonReintentar = document.querySelector("#reintentar-catalogo");

const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

// Cada tarjeta conserva las clases que ya utiliza nuestra hoja de estilos.
function crearTarjeta(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "producto";
  tarjeta.dataset.id = producto.id;

  const imagen = document.createElement("img");
  imagen.className = "imagen-producto";
  imagen.src = producto.imagen;
  imagen.alt = producto.alt;
  imagen.loading = "lazy";

  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.textContent = producto.descripcion;

  const precio = document.createElement("p");
  const valor = formatoPrecio.format(producto.precio);
  precio.textContent = producto.precioDesde
    ? `Desde ${valor} COP; el valor depende de la cantidad.`
    : `Precio: ${valor} COP`;

  tarjeta.append(imagen, titulo, descripcion, precio);
  return tarjeta;
}

// Comprobamos los datos antes de mostrarlos para evitar tarjetas incompletas.
function validarProductos(datos) {
  const camposTexto = ["nombre", "descripcion", "categoria", "imagen", "alt"];
  return Array.isArray(datos) && datos.every(producto =>
    producto !== null &&
    typeof producto === "object" &&
    Number.isInteger(producto.id) &&
    camposTexto.every(campo => typeof producto[campo] === "string" && producto[campo].trim()) &&
    Number.isFinite(producto.precio) && producto.precio >= 0 &&
    typeof producto.precioDesde === "boolean"
  ) && new Set(datos.map(producto => producto.id)).size === datos.length;
}

async function cargarCatalogo() {
  contenedorProductos.setAttribute("aria-busy", "true");
  estadoCatalogo.textContent = "Cargando productos…";
  estadoCatalogo.classList.remove("mensaje-error");
  botonReintentar.hidden = true;
  contenedorProductos.replaceChildren();

  try {
    const respuesta = await fetch("./data.json");

    // fetch no lanza un error automáticamente ante respuestas 404 o 500.
    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        throw new Error("No se encontró el catálogo (404).");
      }
      if (respuesta.status >= 500) {
        throw new Error("El servidor no pudo cargar el catálogo. Intenta más tarde.");
      }
      throw new Error(`No se pudo cargar el catálogo (HTTP ${respuesta.status}).`);
    }

    const productos = await respuesta.json();
    if (!validarProductos(productos)) {
      throw new Error("Los datos del catálogo no tienen el formato esperado.");
    }

    const tarjetas = productos.map(crearTarjeta);
    contenedorProductos.replaceChildren(...tarjetas);
    estadoCatalogo.textContent = productos.length
      ? `${productos.length} productos disponibles.`
      : "Todavía no hay productos disponibles.";
  } catch (error) {
    estadoCatalogo.textContent = error instanceof TypeError
      ? "No se pudo conectar para cargar el catálogo. Revisa tu conexión y vuelve a intentar."
      : error instanceof SyntaxError
        ? "No se pudieron leer los datos del catálogo."
        : error.message;
    estadoCatalogo.classList.add("mensaje-error");
    botonReintentar.hidden = false;
  } finally {
    // Se ejecuta tanto si la carga termina bien como si ocurre un error.
    contenedorProductos.setAttribute("aria-busy", "false");
  }
}

botonReintentar.addEventListener("click", cargarCatalogo);
cargarCatalogo();
