// Clase del objeto tarea
class Filtro {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

// Crea un arreglo tareas con los datos almacenados en la clave "tareas" del localStorage
var filtros = JSON.parse(localStorage.getItem("filtros")) || [];
// indice del array que quiero editar
let indiceEditandoFiltro = null;

// Obtengo el evento de agregar una nueva tarea que es el boton de la bandeja de entrada
document
  .getElementById("nuevoFiltro")
  .addEventListener("click", agregarNuevoFiltro);
// Captura el evento para guardar una tarea que fue editada
document
  .getElementById("guardarFiltro")
  .addEventListener("click", guardarFiltroEditado);
// Captura del evento para cancelar el formulario de editar
document
  .getElementById("desaparecerFormularioEditarFiltro")
  .addEventListener("click", cancelarEdicion);
// Captura del evento para cancelar el formulario de editar (X)
document
  .getElementById("cerrarModalEditando")
  .addEventListener("click", cancelarEdicion);

// Función para agregar un nuevo fitro, recolecta los datos de los input
// Crear un objeto con los datos recolectados y los agregar al arreglo filtros
// Por ultimo envia al arreglo al localStorage con la clave "filtros"
function agregarNuevoFiltro(event) {
  event.preventDefault();
  // Obtengo el valor del nombre del filtro
  const nombreFiltro = document.getElementById("nombreFiltro").value;
  // Creando un objeto Filtro con sus valores que requiere
  const filtro = new Filtro(nombreFiltro);
  // Agrego la nueva filtro(objeto) al arreglo filtros
  filtros.push(filtro);
  // Envio el arreglo tareas al localStorage con clave "filtros"
  localStorage.setItem("filtros", JSON.stringify(filtros));
  // Llamo a la función para limipiar el formulario de Nuevo Filtro
  limpiarFormularioNuevoFiltro();
  // LLamo a la función mostrar tareas y le paso el arreglo tareas que contiene la tarea(objeto)
  mostrarFiltros(filtros);
}

//Función para limpiar los input del formulario de Nueva Tarea
function limpiarFormularioNuevoFiltro() {
  document.getElementById("nombreFiltro").value = "";
}

// Función para Mostrarlas en la interfaz
// Creo un elmento con create element y lo paso al padre que es listaTareas que es un UL en el HTML
function mostrarFiltros(arregloFiltros) {
  const listaFiltros = document.getElementById("listaFiltros");
  listaFiltros.innerHTML = ""; // Limpiar lista antes de mostrar
  //Recorro cada elemento del arreglo, los parametros function(tarea, index)
  // filtro es cada elemento dentro del arreglo, y el index es la posición del elemento en el arreglo
  arregloFiltros.forEach(function (filtro, index) {
    listaFiltros.appendChild(crearElementoFiltro(filtro, index));
  });
  // Actualizar la interfaz si esta vacio o si no esta vacio el arreglo de lista de tareas
  if (!arregloFiltros.length) {
    formularioAñadirFiltro.classList.remove("oculto");
  } else {
    formularioAñadirFiltro.classList.add("oculto");
  }
}

// Función para crear el Elemento Filtro que es li con los botones
// Esta función llama a otros funciones que crean los botones de editar y completar
// Recibe 2 parametros tarea (es cada elemento del array) y el index que es el numero de index del objeto del array
function crearElementoFiltro(filtro, index) {
  // Creo el elemento li para la nueva tarea, se le asigna una clase de css
  const nuevoFiltro = document.createElement("li");
  nuevoFiltro.className = "claseTareas";
  // Crear un P para mostrar el nombre del filtro
  const nombreFiltroP = document.createElement("p");
  nombreFiltroP.textContent = filtro.nombre;
  nombreFiltroP.className = "filtroSeleccionar";
  // 👉 Evento click en el nombre del filtro
  nombreFiltroP.addEventListener("click", function () {
    // Guardar el filtro seleccionado en el localStorage
    localStorage.setItem("filtroSeleccionado", filtro.nombre);

    // Redirigir a la página donde mostrarás las tareas filtradas
    window.location.href = "tareasFiltradas.html";
  });
  // Creo elemento imagen que acompaña a la fecha (calendario)
  const imagenFiltroTarea = document.createElement("img");
  imagenFiltroTarea.src =
    "https://cdn-icons-png.flaticon.com/512/4185/4185783.png ";
  imagenFiltroTarea.className = "imagenesBotonesFecha";
  // Creo un div(flex) para unir la imagen y el nombre del filtro
  const divFechaImagenNombreFiltro = document.createElement("div");
  divFechaImagenNombreFiltro.className = "imagenytextofecha";
  divFechaImagenNombreFiltro.appendChild(imagenFiltroTarea);
  divFechaImagenNombreFiltro.appendChild(nombreFiltroP);
  // Crea el div donde van a estar los botones de eliminar y editar, y se les asigna una clase de css
  const divBotones = document.createElement("div");
  divBotones.className = "divBotones";
  // Creo el boton de completar llamando a la funcion y pasandole el index
  const botonEliminar = crearBotonEliminar(index);
  // Creo el boton de editar llamando a la funcion y pasandole el objeto tarea y el index
  const botonEditar = crearBotonEditar(filtro, index);
  // Uno los elemento padre al hijo
  divBotones.appendChild(botonEditar);
  divBotones.appendChild(botonEliminar);
  nuevoFiltro.appendChild(divFechaImagenNombreFiltro);
  nuevoFiltro.appendChild(divBotones);
  // retornamos el elemento li con todo sus propiedades
  return nuevoFiltro;
}

// Función para crear el boton de completar, crea el elemento y además la función del botón
function crearBotonEliminar(index) {
  const imagenBotonEliminar = document.createElement("img");
  imagenBotonEliminar.src =
    "https://cdn-icons-png.flaticon.com/512/11284/11284890.png";
  imagenBotonEliminar.className = "imagenesBotones";
  //Función de para el completar las tareas
  imagenBotonEliminar.addEventListener("click", function () {
    // Eliminar del array el elemento indicado, el index viene de la funcion mostrarLista -> crearElementoFiltro
    indiceEliminar = index;
    alertaAntesDeEliminarFiltro();
  });
  return imagenBotonEliminar;
}

let indiceEliminar = null;
const formularioEliminarFiltro = document.getElementById(
  "formularioEliminarFiltro"
);
formularioEliminarFiltro.classList.add("oculto");

function alertaAntesDeEliminarFiltro() {
  formularioEliminarFiltro.classList.remove("oculto");
  const pMensajeFiltroEliminar = document.getElementById(
    "alertaEliminarFiltro"
  );
  pMensajeFiltroEliminar.textContent =
    'El filtro "' +
    filtros[indiceEliminar].nombre +
    '" se eliminará de forma permanente y dejará de estar asociado a las tareas.';
}

// Capturo el evento del boton cancelar del formulario para eliminar un nuevo filtro
document
  .getElementById("desaparecerFormularioEliminarFiltro")
  .addEventListener("click", function () {
    formularioEliminarFiltro.classList.add("oculto");
    indiceEliminar == null;
  });

// Capturo el evento del boton eleminar del formulario para eliminar un nuevo filtro
document
  .getElementById("eliminarFiltro")
  .addEventListener("click", function (event) {
    event.preventDefault();

    if (indiceEliminar === null) return; // evita errores si no hay filtro seleccionado

    const nombreFiltro = filtros[indiceEliminar].nombre;

    // Eliminar el filtro del arreglo
    filtros.splice(indiceEliminar, 1);

    // Actualizar localStorage de filtros
    localStorage.setItem("filtros", JSON.stringify(filtros));

    // Actualizar las tareas que tenían ese filtro
    tareas.forEach(function (tarea) {
      if (tarea.filtro === nombreFiltro) {
        tarea.filtro = ""; // deja vacío
      }
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));

    // Volver a mostrar lista actualizada
    mostrarFiltros(filtros);

    // Resetear índice
    indiceEliminar = null;

    formularioEliminarFiltro.classList.add("oculto");
  });

// Función de crear el boton de editar
function crearBotonEditar(filtro, index) {
  const imagenBotonEditar = document.createElement("img");
  imagenBotonEditar.src =
    "https://cdn-icons-png.flaticon.com/512/4103/4103111.png ";
  imagenBotonEditar.className = "imagenesBotones";
  //Función de Editar Tareas
  imagenBotonEditar.addEventListener("click", function () {
    //ocultar el formulario de crear
    formularioAñadirFiltro.classList.add("oculto");
    //mostar el formulario de editar
    formularioEditarFiltro.classList.remove("oculto");
    // Asigno al indice Editando el index que viene de cuando hacemos click al boton de editar, para ocuparlo en otra función, este viende de la funcion MostrarLista -> CrearElementoLista
    indiceEditandoFiltro = index;
    // Le asigno al input del formulario Editar el nombre de la tarea que seleccione para editar, y esa tarea viene del objeto que se le paso a esta funcion
    document.getElementById("nombreFiltroEditar").value = filtro.nombre;
    //ocultar el formulario de editar cuando le de cancelar
  });
  return imagenBotonEditar;
}

function cancelarEdicion() {
  formularioEditarFiltro.classList.add("oculto");
  indiceEditandoFiltro = null; // Como se cancela la edicion borrar el indice que se guardo;
}

// Función que guarda el filtro que se ha editado
function guardarFiltroEditado(event) {
  event.preventDefault();
  if (indiceEditandoFiltro !== null) {
    //guardar el nuevo nombre del filtro
    const nombreFiltroEditado =
      document.getElementById("nombreFiltroEditar").value;
    filtros[indiceEditandoFiltro].nombre = nombreFiltroEditado;
    formularioEditarFiltro.classList.add("oculto");
    // Como se acaba de editar un objeto del arreglo tareas, lo envio de nuevo al LocalStorage para que se actualice
    localStorage.setItem("filtros", JSON.stringify(filtros));
    mostrarFiltros(filtros); // Vuelvo a mostrar la lista actualizada
    indiceEditandoFiltro = null; // Como ya se edito, volver a dejar el indice del arreglo null para otras ediciones
  }
}

// Logico de ocultar y mostrar elementos de la interfaz
const formularioAñadirFiltro = document.getElementById(
  "formularioAñadirFiltro"
);
const formularioEditarFiltro = document.getElementById(
  "formularioEditarFiltro"
);

const h1FiltrosyEtiquetas = document.getElementById("h1FiltrosyEtiquetas");

formularioAñadirFiltro.classList.add("oculto");
formularioEditarFiltro.classList.add("oculto");

// Capturo el evento del boton cancelar del formulario para añadir una nueva tarea
document
  .getElementById("desaparecerFormularioNuevoFiltro")
  .addEventListener("click", function () {
    formularioAñadirFiltro.classList.add("oculto");
    limpiarFormularioNuevoFiltro();
  });

// Capturo el evento del boton añadir tarea que aparece al finalizar la lista de tareas
document
  .getElementById("añadirfiltroaoculto")
  .addEventListener("click", function () {
    formularioAñadirFiltro.classList.remove("oculto");
  });

// Verificación inicial, por si hay tareas en el LocalStorage
if (filtros.length !== 0) {
  document.addEventListener("DOMContentLoaded", () => mostrarFiltros(filtros));
  h1FiltrosyEtiquetas.classList.remove("oculto");
} else {
  //bandejaEntrada.classList.remove("oculto");
}

document.getElementById("cerrarModal").addEventListener("click", function () {
  formularioAñadirFiltro.classList.add("oculto");
  limpiarFormularioNuevoFiltro();
});

// ---------------------------------------- AÑADIR TAREA DESDE EL MENÚ ----------------------------------------------------------

// Lógica de mostrar los filtros
// Select para editar
const selectFiltroEditar = document.getElementById(
  "opcionesFiltrosNuevaTareaMenu"
);

var arregloFiltros = JSON.parse(localStorage.getItem("filtros")) || [];

arregloFiltros.forEach(function (filtro) {
  const opcion = document.createElement("option");

  // El value se guarda limpio (solo el nombre)
  opcion.value = filtro.nombre;

  // El texto mostrado lleva emoji
  switch (filtro.nombre) {
    case "Prioridad 1":
      opcion.textContent = "🔴 " + filtro.nombre;
      break;
    case "Prioridad 2":
      opcion.textContent = "🟠 " + filtro.nombre;
      break;
    case "Prioridad 3":
      opcion.textContent = "🔵 " + filtro.nombre;
      break;
    case "Prioridad 4":
      opcion.textContent = "🟢 " + filtro.nombre;
      break;
    default:
      opcion.textContent = filtro.nombre;
  }

  selectFiltroEditar.appendChild(opcion);
});

const formulatioAñadirTareaMenu = document.getElementById(
  "formulario-tareas-menu"
);

formulatioAñadirTareaMenu.classList.add("oculto");

// Capturo el evento del añadirTarea que esta en el menu
document
  .getElementById("iconoañadirTarea")
  .addEventListener("click", function () {
    formulatioAñadirTareaMenu.classList.remove("oculto");
  });

// Capturo el evento del boton cancelar del formulario para añadir una nueva tarea desde el menu
document
  .getElementById("desaparecerFormularioAñadirTareaMenu")
  .addEventListener("click", function () {
    formulatioAñadirTareaMenu.classList.add("oculto");
    limpiarFormularioNuevaTarea();
  });

//Función para limpiar los input del formulario de Nueva Tarea del menu
function limpiarFormularioNuevaTarea() {
  document.getElementById("nombreTareaMenu").value = "";
  document.getElementById("descripcionTareaMenu").value = "";
  document.getElementById("fechaTareaMenu").value = "";
}

// Obtengo el evento de agregar una nueva tarea que es el boton de añadir pero del formulario que se despliega desde el menú
document
  .getElementById("nuevaTareaMenu")
  .addEventListener("click", agregarNuevaTareaMenu);

// Función para agregar una nueva tarea, recolecta los datos de los input
// Crear un objeto con los datos recolectados y los agregar al arreglo tareas
// Por ultimo envia al arreglo al localStorage con la clave "tareas"
function agregarNuevaTareaMenu(event) {
  event.preventDefault();
  // Obtengo el valor del nombre de la tarea
  const nombreTarea = document.getElementById("nombreTareaMenu").value;
  // Obtengo el valor de decripción de la tarea
  const descripcionTarea = document.getElementById(
    "descripcionTareaMenu"
  ).value;
  // Obtengo el valor de la fecha de la tarea
  const fechaTarea = document.getElementById("fechaTareaMenu").value;
  // Obtengo el valor del nombre del filtro aplicado
  const nombreFiltro = document.getElementById(
    "opcionesFiltrosNuevaTareaMenu"
  ).value;
  // Creando un objeto Tarea con sus valores que requiere
  const tarea = new Tarea(
    nombreTarea,
    descripcionTarea,
    fechaTarea,
    nombreFiltro
  );
  // Agrego la nueva tarea(objeto) al arreglo tareas
  tareas.push(tarea);
  // Envio el arreglo tareas al localStorage con clave "tareas"
  localStorage.setItem("tareas", JSON.stringify(tareas));
  // Llamo a la faunción para limipiar el formulario de Nueva Tarea
  limpiarFormularioNuevaTarea();
  //Llamo a la función para desaparecer el formulario
  formulatioAñadirTareaMenu.classList.add("oculto");
}

// Clase del objeto tarea
class Tarea {
  constructor(name, descripcion, fecha, filtro) {
    this.name = name;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.filtro = filtro;
  }
}

// Crea un arreglo tareas con los datos almacenados en la clave "tareas" del localStorage
var tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// ✅ Validación de que la tarea tenga al menos el nombre antes agregar
const inputNombreTareaMenu = document.getElementById("nombreTareaMenu");
const btnAñadirNuevaTareaMenu = document.getElementById("nuevaTareaMenu");
const formularioAñadirTareaMenu = document.querySelector(
  "#formulario-tareas-menu form"
);

// función para activar/desactivar el botón
function actualizarEstadoBoton() {
  const vacio = inputNombreTareaMenu.value.trim() === "";
  btnAñadirNuevaTareaMenu.disabled = vacio;
  btnAñadirNuevaTareaMenu.classList.toggle("deshabilitado", vacio);
}

// Inicializar estado al cargar
actualizarEstadoBoton();

// escuchar input
inputNombreTareaMenu.addEventListener("input", actualizarEstadoBoton);

// interceptar envío del form
formularioAñadirTareaMenu.addEventListener("submit", function (e) {
  e.preventDefault();
  if (btnAñadirNuevaTareaMenu.disabled) return; // seguridad extra
  agregarNuevaTareaMenu();
});

// ✅ Validación de que el filtro tenga al menos el nombre antes AGREGAR
const inputNombreFiltroNuevo = document.getElementById("nombreFiltro");
const btnAñadirNuevoFiltro = document.getElementById("nuevoFiltro");
const formularioAñadirFiltroValidación = document.querySelector(
  "#formularioAñadirFiltro form"
);

// función para activar/desactivar el botón
function actualizarEstadoBotonNuevoFiltro() {
  const vacio = inputNombreFiltroNuevo.value.trim() === "";
  btnAñadirNuevoFiltro.disabled = vacio;
  btnAñadirNuevoFiltro.classList.toggle("deshabilitado", vacio);
}

// Inicializar estado al cargar
actualizarEstadoBotonNuevoFiltro();

// escuchar input
inputNombreFiltroNuevo.addEventListener(
  "input",
  actualizarEstadoBotonNuevoFiltro
);

// interceptar envío del form
formularioAñadirFiltroValidación.addEventListener("submit", function (e) {
  e.preventDefault();
  if (btnAñadirNuevoFiltro.disabled) return; // seguridad extra
  agregarNuevoFiltro();
});

// ✅ Validación de que el filtro tenga al menos el nombre antes EDITAR
const inputNombreFiltroEditado = document.getElementById("nombreFiltroEditar");
const btnGuardarFiltroEditado = document.getElementById("guardarFiltro");
const formularioEditarFiltroValidación = document.querySelector(
  "#formularioEditarFiltro form"
);

// función para activar/desactivar el botón
function actualizarEstadoBotonEditarFiltro() {
  const vacio = inputNombreFiltroEditado.value.trim() === "";
  btnGuardarFiltroEditado.disabled = vacio;
  btnGuardarFiltroEditado.classList.toggle("deshabilitado", vacio);
}

// Inicializar estado al cargar
actualizarEstadoBotonEditarFiltro();

// escuchar input
inputNombreFiltroEditado.addEventListener(
  "input",
  actualizarEstadoBotonEditarFiltro
);

// interceptar envío del form
formularioEditarFiltroValidación.addEventListener("submit", function (e) {
  e.preventDefault();
  if (btnGuardarFiltroEditado.disabled) return; // seguridad extra
  guardarFiltroEditado();
});
