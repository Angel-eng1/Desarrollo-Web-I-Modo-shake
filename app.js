// ==================================================
// CARRITO
// ==================================================

// Este módulo conserva identificadores y cantidades. Los precios vienen del catálogo.
const Carrito = (() => {
  const CLAVE = "modo-shake-carrito";
  const MAXIMO = 99;
  let catalogo = [];
  let items = [];
  let iniciado = false;
  const lista = document.querySelector("#lista-carrito");
  const estado = document.querySelector("#estado-carrito");
  const aviso = document.querySelector("#aviso-guardado");
  const contador = document.querySelector("#contador-carrito");
  const total = document.querySelector("#total-carrito");
  const notaPrecio = document.querySelector("#nota-precio-carrito");
  const vaciar = document.querySelector("#vaciar-carrito");
  const moneda = new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  });

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
      aviso.textContent = "";
    } catch {
      aviso.textContent = "No se pudo guardar el carrito en este navegador. Los cambios solo se conservarán mientras esta página siga abierta.";
    }
  }

  function recuperar() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE) || "[]");
      if (!Array.isArray(datos)) throw new Error("Carrito inválido");
      const ids = new Set();
      // Ignoramos registros dañados y productos que ya no estén en el catálogo.
      items = datos.filter(item => {
        if (!item || !Number.isInteger(item.id) || !Number.isInteger(item.cantidad) ||
            item.cantidad < 1 || item.cantidad > MAXIMO || ids.has(item.id) ||
            !catalogo.some(producto => producto.id === item.id)) return false;
        ids.add(item.id);
        return true;
      }).map(item => ({ id: item.id, cantidad: item.cantidad }));
      if (items.length !== datos.length) {
        aviso.textContent = "Se recuperaron los productos válidos del carrito guardado.";
      }
    } catch {
      items = [];
      aviso.textContent = "No se pudo recuperar el carrito guardado. Puedes comenzar una nueva selección.";
    }
  }

  function mostrar() {
    const filas = items.map(item => {
      const producto = catalogo.find(producto => producto.id === item.id);
      const fila = document.createElement("li");
      fila.className = "item-carrito";

      const imagen = document.createElement("img");
      imagen.className = "miniatura-carrito";
      imagen.src = producto.imagen;
      imagen.alt = producto.alt;
      const detalle = document.createElement("div");
      detalle.className = "detalle-carrito";
      const categoria = document.createElement("small");
      categoria.textContent = producto.categoria;
      const unitario = document.createElement("p");
      unitario.textContent = `${producto.precioDesde ? "Desde " : ""}${moneda.format(producto.precio)} COP / unidad`;
      const nombre = document.createElement("strong");
      nombre.textContent = producto.nombre;
      const subtotal = document.createElement("span");
      subtotal.className = "subtotal-carrito";
      subtotal.textContent = `${producto.precioDesde ? "Desde " : ""}${moneda.format(producto.precio * item.cantidad)} COP`;

      const label = document.createElement("label");
      label.htmlFor = `cantidad-${item.id}`;
      label.textContent = "Cantidad";
      const cantidad = document.createElement("input");
      cantidad.type = "number";
      cantidad.id = label.htmlFor;
      cantidad.min = "1";
      cantidad.max = String(MAXIMO);
      cantidad.step = "1";
      cantidad.value = item.cantidad;
      cantidad.setAttribute("aria-label", `Cantidad de ${producto.nombre}`);
      cantidad.addEventListener("change", () => {
        const valor = Number(cantidad.value);
        if (!Number.isInteger(valor) || valor < 1 || valor > MAXIMO) {
          estado.textContent = `Escribe una cantidad entera entre 1 y ${MAXIMO}.`;
          cantidad.value = item.cantidad;
          return;
        }
        item.cantidad = valor;
        guardar();
        mostrar();
        document.getElementById(cantidad.id)?.focus();
        estado.textContent = "Cantidad actualizada.";
      });

      const eliminar = document.createElement("button");
      eliminar.type = "button";
      eliminar.className = "boton-texto eliminar-carrito";
      eliminar.textContent = "Eliminar";
      eliminar.setAttribute("aria-label", `Eliminar ${producto.nombre} del carrito`);
      eliminar.addEventListener("click", () => {
        items = items.filter(actual => actual.id !== item.id);
        guardar();
        mostrar();
        estado.textContent = `${producto.nombre} eliminado del carrito.`;
        // Conservamos un destino de teclado después de eliminar el botón activo.
        const siguiente = lista.querySelector("input");
        if (siguiente) siguiente.focus();
        else document.querySelector("#titulo-carrito").focus();
      });

      detalle.append(categoria, nombre, unitario);
      const control = document.createElement("div");
      control.className = "cantidad-carrito";
      control.append(label, cantidad);
      fila.append(imagen, detalle, control, subtotal, eliminar);
      return fila;
    });
    lista.replaceChildren(...filas);
    const unidades = items.reduce((suma, item) => suma + item.cantidad, 0);
    const importe = items.reduce((suma, item) =>
      suma + catalogo.find(producto => producto.id === item.id).precio * item.cantidad, 0);
    const estimado = items.some(item => catalogo.find(producto => producto.id === item.id).precioDesde);
    contador.textContent = unidades;
    total.textContent = `${estimado ? "Total estimado" : "Total"}: ${moneda.format(importe)} COP`;
    notaPrecio.hidden = !estimado;
    vaciar.disabled = items.length === 0;
    document.querySelector("#carrito-vacio").hidden = items.length !== 0;
    estado.textContent = items.length ? `${unidades} unidades en tu carrito.` : "Tu carrito está vacío.";
  }

  function agregar(id) {
    const producto = catalogo.find(producto => producto.id === id);
    if (!iniciado || !producto) return;
    const existente = items.find(item => item.id === id);
    if (existente && existente.cantidad >= MAXIMO) {
      estado.textContent = `Puedes agregar hasta ${MAXIMO} unidades de cada producto.`;
      document.dispatchEvent(new CustomEvent("carrito:aviso", { detail: estado.textContent }));
      return;
    }
    if (existente) existente.cantidad += 1;
    else items.push({ id, cantidad: 1 });
    guardar();
    mostrar();
    estado.textContent = `${producto.nombre} agregado al carrito.`;
    document.dispatchEvent(new CustomEvent("carrito:aviso", { detail: estado.textContent }));
  }

  function iniciar(productos) {
    catalogo = productos;
    if (!iniciado) recuperar();
    iniciado = true;
    mostrar();
  }

  vaciar.addEventListener("click", () => {
    items = [];
    guardar();
    mostrar();
    document.querySelector("#titulo-carrito").focus();
  });

  return { iniciar, agregar };
})();

// ==================================================
// CATÁLOGO Y FILTROS
// ==================================================

// defer permite ejecutar este archivo después de que se haya leído el HTML.
const contenedorProductos = document.querySelector("#listado-productos");
const estadoCatalogo = document.querySelector("#estado-catalogo");
const botonReintentar = document.querySelector("#reintentar-catalogo");

const buscador = document.querySelector("#buscar-producto");
const botonLimpiar = document.querySelector("#limpiar-filtros");
const botonesCategorias = document.querySelectorAll("[data-categoria]");

// Conservamos todos los productos; filtrar solo cambia los que mostramos.
let productosCatalogo = [];
let categoriaSeleccionada = "";

function normalizarTexto(texto) {
  return texto.trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrarProductos(productos, categoria, busqueda) {
  const termino = normalizarTexto(busqueda);
  return productos.filter(producto =>
    (!categoria || producto.categoria === categoria) &&
    normalizarTexto(producto.nombre).includes(termino)
  );
}

function actualizarCatalogo() {
  const resultados = filtrarProductos(productosCatalogo, categoriaSeleccionada, buscador.value);
  contenedorProductos.replaceChildren(...resultados.map(crearTarjeta));

  if (productosCatalogo.length === 0) {
    estadoCatalogo.textContent = "Todavía no hay productos disponibles.";
  } else if (resultados.length === 0) {
    estadoCatalogo.textContent = "No encontramos productos con esos filtros. Prueba otro nombre o limpia los filtros.";
  } else {
    estadoCatalogo.textContent = `${resultados.length} ${resultados.length === 1 ? "producto encontrado" : "productos encontrados"}.`;
  }
}

function seleccionarCategoria(categoria) {
  categoriaSeleccionada = categoria;
  botonesCategorias.forEach(boton => {
    boton.setAttribute("aria-pressed", String(boton.dataset.categoria === categoria));
  });
}

function habilitarFiltros(habilitados) {
  buscador.disabled = !habilitados;
  botonLimpiar.disabled = !habilitados;
  botonesCategorias.forEach(boton => { boton.disabled = !habilitados; });
}

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
  precio.className = "precio-producto";
  const valor = formatoPrecio.format(producto.precio);
  precio.textContent = producto.precioDesde
    ? `Desde ${valor} COP; el valor depende de la cantidad.`
    : `Precio: ${valor} COP`;

  const agregar = document.createElement("button");
  agregar.type = "button";
  agregar.className = "boton";
  agregar.textContent = "Agregar al carrito";
  agregar.setAttribute("aria-label", `Agregar ${producto.nombre} al carrito`);
  agregar.addEventListener("click", () => Carrito.agregar(producto.id));

  tarjeta.append(imagen, titulo, descripcion, precio, agregar);
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
  habilitarFiltros(false);
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

    productosCatalogo = productos;
    Carrito.iniciar(productos);
    actualizarCatalogo();
    habilitarFiltros(true);
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

// input responde mientras escribes; click cambia la categoría sin recargar.
buscador.addEventListener("input", actualizarCatalogo);
botonesCategorias.forEach(boton => {
  boton.addEventListener("click", () => {
    seleccionarCategoria(boton.dataset.categoria);
    actualizarCatalogo();
  });
});
botonLimpiar.addEventListener("click", () => {
  buscador.value = "";
  seleccionarCategoria("");
  actualizarCatalogo();
  buscador.focus();
});

botonReintentar.addEventListener("click", cargarCatalogo);
cargarCatalogo();

// ==================================================
// NAVEGACIÓN ENTRE VISTAS
// ==================================================

// Vistas con JavaScript nativo. El hash permite compartir enlaces y usar Atrás.
const vistas = [...document.querySelectorAll("main > section")];
const enlacesMenu = document.querySelectorAll(".encabezado nav a");
const tituloBase = "Modo Shake | Fit market";

function mostrarVista(enfocar = false) {
  const destino = document.getElementById(location.hash.slice(1));
  const vista = vistas.includes(destino) ? destino : document.querySelector("#inicio");
  vistas.forEach(seccion => { seccion.hidden = seccion !== vista; });
  enlacesMenu.forEach(enlace => {
    if (enlace.hash === `#${vista.id}`) enlace.setAttribute("aria-current", "page");
    else enlace.removeAttribute("aria-current");
  });
  const titulo = vista.querySelector("h1, h2");
  document.title = `${titulo.textContent.trim()} | ${tituloBase}`;
  if (enfocar) {
    titulo.setAttribute("tabindex", "-1");
    titulo.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

document.addEventListener("click", evento => {
  const enlace = evento.target.closest('a[href^="#"]');
  if (!enlace || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
  if (enlace.hash === "#contenido") {
    evento.preventDefault();
    const contenido = document.querySelector("#contenido");
    contenido.setAttribute("tabindex", "-1");
    contenido.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }
  if (enlace.hasAttribute("data-elegir-categoria")) {
    buscador.value = "";
    seleccionarCategoria(enlace.dataset.elegirCategoria);
    // Si aún se están cargando los datos, el filtro se aplicará al recibirlos.
    if (!buscador.disabled) actualizarCatalogo();
  }
  if (vistas.some(vista => enlace.hash === `#${vista.id}`) && enlace.hash === location.hash) {
    evento.preventDefault();
    mostrarVista(true);
  }
});

window.addEventListener("hashchange", () => mostrarVista(true));
mostrarVista();

let tiempoAviso;
document.addEventListener("carrito:aviso", evento => {
  const aviso = document.querySelector("#aviso-flotante");
  aviso.hidden = false;
  document.querySelector("#texto-aviso").textContent = evento.detail;
  clearTimeout(tiempoAviso);
  tiempoAviso = setTimeout(() => { aviso.hidden = true; }, 5000);
});


// ==================================================
// FORMULARIO: VALIDACIÓN Y PERSISTENCIA LOCAL
// ==================================================

const formularioContacto = document.querySelector("#formulario-contacto");
const camposContacto = [...formularioContacto.querySelectorAll("input, select, textarea")];
const estadoFormulario = document.querySelector("#estado-formulario");
const listaConsultas = document.querySelector("#lista-consultas");
const CLAVE_BORRADOR = "modo-shake-borrador";
const CLAVE_CONSULTAS = "modo-shake-consultas";
let consultas = [];

function leerLocal(clave, valorInicial) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return datos === null ? valorInicial : datos;
  } catch {
    estadoFormulario.textContent = "No se pudieron recuperar todos los datos guardados en este navegador.";
    return valorInicial;
  }
}

function guardarLocal(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
    return true;
  } catch {
    estadoFormulario.textContent = "Este navegador no permitió guardar los datos. Revisa sus permisos de almacenamiento.";
    return false;
  }
}

function borrarLocal(clave) {
  try {
    localStorage.removeItem(clave);
  } catch {
    estadoFormulario.textContent = "No se pudo borrar el borrador guardado.";
  }
}

function datosFormulario() {
  return Object.fromEntries(camposContacto.map(campo => [campo.name, campo.value.trim()]));
}

function guardarBorrador() {
  guardarLocal(CLAVE_BORRADOR, datosFormulario());
}

function mensajeCampo(campo) {
  const validez = campo.validity;
  if (validez.valueMissing) return "Este campo es obligatorio.";
  if (validez.typeMismatch) return "Escribe un correo electrónico válido.";
  if (validez.patternMismatch) return "Escribe 10 números, sin espacios ni letras.";
  if (validez.tooShort) return `Escribe al menos ${campo.minLength} caracteres.`;
  if (validez.tooLong) return `Escribe máximo ${campo.maxLength} caracteres.`;
  if (validez.rangeUnderflow) return `El valor mínimo es ${campo.min}.`;
  if (validez.rangeOverflow) return `El valor máximo es ${campo.max}.`;
  if (validez.badInput || validez.stepMismatch) return "Escribe un número entero válido.";
  if (campo.name === "fecha" && campo.value) {
    const hoy = new Date();
    const fechaLocal = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    if (campo.value < fechaLocal) return "Elige una fecha de hoy o posterior.";
  }
  return "";
}

function validarCampo(campo) {
  const mensaje = mensajeCampo(campo);
  const aviso = document.getElementById(`error-${campo.id}`);
  aviso.textContent = mensaje;
  campo.setAttribute("aria-invalid", String(Boolean(mensaje)));
  return !mensaje;
}

camposContacto.forEach(campo => {
  const aviso = document.createElement("small");
  aviso.className = "error-campo";
  aviso.id = `error-${campo.id}`;
  campo.closest(".campo-formulario").append(aviso);
  campo.setAttribute("aria-describedby", aviso.id);
  campo.addEventListener("input", () => {
    validarCampo(campo);
    guardarBorrador();
  });
  campo.addEventListener("change", () => {
    validarCampo(campo);
    guardarBorrador();
  });
});

const borrador = leerLocal(CLAVE_BORRADOR, {});
if (borrador && typeof borrador === "object" && !Array.isArray(borrador)) {
  camposContacto.forEach(campo => {
    if (typeof borrador[campo.name] === "string") campo.value = borrador[campo.name];
  });
}
const datosGuardados = leerLocal(CLAVE_CONSULTAS, []);
consultas = Array.isArray(datosGuardados)
  ? datosGuardados.filter(dato => dato && typeof dato.id === "string" && typeof dato.nombre === "string")
  : [];

function mostrarConsultas() {
  listaConsultas.replaceChildren();
  if (!consultas.length) {
    const vacia = document.createElement("li");
    vacia.textContent = "Aún no tienes consultas guardadas.";
    listaConsultas.append(vacia);
    return;
  }
  consultas.forEach(consulta => {
    const fila = document.createElement("li");
    const datos = document.createElement("div");
    const nombre = document.createElement("strong");
    nombre.textContent = consulta.nombre;
    const resumen = document.createElement("p");
    const motivos = {
      menu: "Consulta del menú",
      ubicacion: "Ubicación u horario",
      otro: "Otra consulta"
    };
    resumen.textContent = `${motivos[consulta.motivo] || "Consulta"} · ${consulta.fecha} · ${consulta.personas} persona(s)`;
    const detalles = document.createElement("details");
    const titulo = document.createElement("summary");
    titulo.textContent = "Ver datos guardados";
    const contacto = document.createElement("p");
    contacto.textContent = `Correo: ${consulta.correo} · Teléfono: ${consulta.telefono}`;
    const mensaje = document.createElement("p");
    mensaje.textContent = consulta.mensaje || "Sin mensaje adicional.";
    detalles.append(titulo, contacto, mensaje);
    datos.append(nombre, resumen, detalles);
    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.className = "boton-texto";
    eliminar.textContent = "Eliminar";
    eliminar.setAttribute("aria-label", `Eliminar consulta de ${consulta.nombre}`);
    eliminar.addEventListener("click", () => {
      const anteriores = consultas;
      consultas = consultas.filter(item => item.id !== consulta.id);
      if (!guardarLocal(CLAVE_CONSULTAS, consultas)) {
        consultas = anteriores;
        return;
      }
      mostrarConsultas();
      estadoFormulario.textContent = "Consulta eliminada de este navegador.";
    });
    fila.append(datos, eliminar);
    listaConsultas.append(fila);
  });
}
mostrarConsultas();

formularioContacto.addEventListener("submit", evento => {
  evento.preventDefault();
  const invalidos = camposContacto.filter(campo => !validarCampo(campo));
  if (invalidos.length) {
    estadoFormulario.textContent = "Revisa los campos marcados antes de guardar la consulta.";
    invalidos[0].focus();
    return;
  }

  const consulta = { id: crypto.randomUUID(), ...datosFormulario() };
  const nuevas = [consulta, ...consultas];
  if (!guardarLocal(CLAVE_CONSULTAS, nuevas)) return;
  consultas = nuevas;
  formularioContacto.reset();
  camposContacto.forEach(campo => {
    campo.setAttribute("aria-invalid", "false");
    document.getElementById(`error-${campo.id}`).textContent = "";
  });
  borrarLocal(CLAVE_BORRADOR);
  mostrarConsultas();
  estadoFormulario.textContent = "Consulta guardada en este navegador. No fue enviada al restaurante.";
});
