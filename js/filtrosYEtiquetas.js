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
  nombreFiltroP.className = "filtroSeleccionar"
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
    filtros.splice(index, 1);
    // Actualizo el arreglo tareas en el LocalStorage
    localStorage.setItem("filtros", JSON.stringify(filtros));
    // Volver a mostrar lista actualizada, el tareas llamado es el array que esta fuera, este tareas es el que esta definido al principio del codigo
    mostrarFiltros(filtros);
  });
  return imagenBotonEliminar;
}

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
  // Creando un objeto Tarea con sus valores que requiere
  const tarea = new Tarea(nombreTarea, descripcionTarea, fechaTarea);
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
  constructor(name, descripcion, fecha) {
    this.name = name;
    this.descripcion = descripcion;
    this.fecha = fecha;
  }
}

// Crea un arreglo tareas con los datos almacenados en la clave "tareas" del localStorage
var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
