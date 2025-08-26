// indice del array que quiero editar
let indiceEditando = null;
// Captura el evento para guardar una tarea que fue editada
document
  .getElementById("guardarTarea")
  .addEventListener("click", guardarTareaEditada);
// Captura del evento para cancelar el formulario de editar
document
  .getElementById("desaparecerFormularioEditar")
  .addEventListener("click", cancelarEdicion);
// Crear un arreglo de las tareas completadas con los datos en la clave "tareasCompletadas" del localStorage
var tareasCompletadasArreglo =
  JSON.parse(localStorage.getItem("tareasCompletadas")) || [];
// Captura el evento de cargar el DOM y llama a la función que mostrará las tareas de HOY
document.addEventListener("DOMContentLoaded", tareasHoy);

// Función que se llama al cargar el DOM que filtra las tareas del día HOY
function tareasHoy(event) {
  event.preventDefault();
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  mostrarTareasHoy(tareas);
}

// Función que muestra solo las tareas del día HOY
function mostrarTareasHoy(arregloTareas) {
  const listaTareasHoy = document.getElementById("listaTareasHoy");
  listaTareasHoy.innerHTML = ""; // Limpiar lista antes de mostrar

  // Obtener fecha de HOY en formato YYYY-MM-DD
  const hoy = new Date();
  const fechaHoy = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${hoy.getDate().toString().padStart(2, "0")}`;

  // Filtrar tareas cuya fecha === hoy
  const tareasDeHoy = arregloTareas.filter((tarea) => tarea.fecha === fechaHoy);

  if (tareasDeHoy.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No hay tareas asignadas para hoy.";
    mensaje.className = "mensajeVacio";
    listaTareasHoy.appendChild(mensaje);
    return;
  }

  tareasDeHoy.forEach((tarea, index) => {
    listaTareasHoy.appendChild(crearElementoTarea(tarea, index));
  });
}

// Función para crear el Elemento Tarea que es li con los botones
// Esta función llama a otros funciones que crean los botones de editar y completar, también llama a función que crea un div para juntar una imagen y un texto
// Recibe 2 parametros tarea (es cada elemento del array) y el index que es el numero de index del objeto del array
function crearElementoTarea(tarea, index) {
  // Creo el elemento li para la nueva tarea, se le asigna una clase de css
  const nuevaTarea = document.createElement("li");
  nuevaTarea.className = "claseTareas";
  // Creo un div en el que ira el nombre, fecha de la tarea y filtro aplicado cada uno con un div
  const contenedorTarea = document.createElement("div");
  contenedorTarea.className = "contenedorListaTarea";
  // Crear un P para mostrar el nombre de la tarea
  const nombreTareaP = document.createElement("p");
  nombreTareaP.textContent = tarea.name;
  // uno el nombre de la tarea al div creado
  contenedorTarea.appendChild(nombreTareaP);
  // Crear un P para mostar la descripción de la tarea y se le asigna una clase css
  const descripcionTareaP = document.createElement("p");
  descripcionTareaP.textContent = tarea.descripcion;
  descripcionTareaP.className = "fechaTarea";
  // Validación para agregar el elemento (hijo) p que contiene la descripción de la tarea al padre (div)
  if (tarea.descripcion) {
    // Si el elemento tarea tiene descricipción se une al div creado
    contenedorTarea.appendChild(descripcionTareaP);
  }
  // Crear un P para mostrar el nombre del filtro y se le asiga un css
  const pNombreFiltro = document.createElement("p");
  pNombreFiltro.textContent = tarea.filtro;
  pNombreFiltro.className = "fechaTarea";
  // Llamado a la función para decidir el color del texto (depende de que filtro tenga la tarea)
  const nombreFiltro = colorNombreFiltro(pNombreFiltro);
  // Creo un div(flex) para unir la imagen y el nombre del filtro, llamado a la función que crea el div, con parametros (url, elemento)
  const divFiltroImagenTarea = crearElementoConIcono(
    "https://cdn-icons-png.flaticon.com/512/10406/10406997.png",
    nombreFiltro
  );
  // Validación si la tarea tiene filtro, entonces agregar el elmento hijo al padre
  if (tarea.filtro) {
    contenedorTarea.appendChild(divFiltroImagenTarea);
  }
  // Crea el div donde van a estar los botones de completar y editar, y se les asigna una clase de css
  const divBotones = document.createElement("div");
  divBotones.className = "divBotones";
  // Creo el boton de completar llamando a la funcion y pasandole el index
  const botonCompletar = crearBotonCompletar(index, nombreFiltro);
  // Creo el boton de editar llamando a la funcion y pasandole el objeto tarea y el index
  const botonEditar = crearBotonEditar(tarea, index);
  // Uno los elemento padre al hijo
  divBotones.appendChild(botonEditar);
  nuevaTarea.appendChild(botonCompletar);
  nuevaTarea.appendChild(contenedorTarea);
  nuevaTarea.appendChild(divBotones);
  // retornamos el elemento li con todo sus propiedades
  return nuevaTarea;
}
// Función que asigna clase(diferentes colores de texto), para el texto de filtro en el elemento tarea
function colorNombreFiltro(nombreFiltro, index) {
  const tipoFiltro = nombreFiltro.textContent;
  if (tipoFiltro == "Prioridad 1") {
    nombreFiltro.classList.add("prioridad1");
  } else if (tipoFiltro == "Prioridad 2") {
    nombreFiltro.classList.add("prioridad2");
  } else if (tipoFiltro == "Prioridad 3") {
    nombreFiltro.classList.add("prioridad3");
  } else if (tipoFiltro == "Prioridad 4") {
    nombreFiltro.classList.add("prioridad4");
  }
  return nombreFiltro;
}
// Función para el div que lleva la imagen y un nombre a la par como Fecha (imagen de calendario y el texto de la fecha)
function crearElementoConIcono(src, texto, claseTexto) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "imagenesBotonesFecha";
  const div = document.createElement("div");
  div.className = "imagenytextofecha";
  div.appendChild(img);
  div.appendChild(texto);
  return div;
}

// Función para crear el boton de completar, crea el elemento y además la función del botón
function crearBotonCompletar(index, nombreFiltro) {
  const BotonCompletado = document.createElement("input");
  BotonCompletado.type = "radio"; // tipo radio
  //Función de para el completar las tareas
  BotonCompletado.addEventListener("click", function () {
    // Eliminar del array y crea un nuevo array que es el que voy a mostrar con completadas, el index viene de la funcion mostrarLista -> crearElementoLista
    // agrego al arreglo de Tareas Completadas el elemento que se acaba de eliminar del arreglo de tareas
    // lo guardamos en una nueva constante para agregarle la propiedad de completadaEn que llevara la fecha en el momento que se compelto la tarea
    const tareaCompletada = tareas.splice(index, 1)[0];
    tareaCompletada.completadaEn = new Date().toLocaleString();
    tareasCompletadasArreglo.push(tareaCompletada);
    // Envio ese nuevo arreglo para que se sobreescriba el que ya estaba en el LocalStorage, haciendo que se guarde la nueva tarea completada
    localStorage.setItem(
      "tareasCompletadas",
      JSON.stringify(tareasCompletadasArreglo)
    );
    // Actualizo el arreglo tareas en el LocalStorage
    localStorage.setItem("tareas", JSON.stringify(tareas));
    // Volver a mostrar lista actualizada, el tareas llamado es el array que esta fuera, este tareas es el que esta definido al principio del codigo
    mostrarTareasHoy(tareas);
  });

  const tipoFiltro = nombreFiltro.textContent;

  // Asignar estilo según la prioridad, cambio el color del border del input radio
  if (tipoFiltro === "Prioridad 1") {
    BotonCompletado.classList.add("prioridad1-radio");
  } else if (tipoFiltro === "Prioridad 2") {
    BotonCompletado.classList.add("prioridad2-radio");
  } else if (tipoFiltro === "Prioridad 3") {
    BotonCompletado.classList.add("prioridad3-radio");
  } else if (tipoFiltro === "Prioridad 4") {
    BotonCompletado.classList.add("prioridad4-radio");
  }

  return BotonCompletado;
}

// Función de crear el boton de editar
function crearBotonEditar(tarea, index) {
  const imagenBotonEditar = document.createElement("img");
  imagenBotonEditar.src =
    "https://cdn-icons-png.flaticon.com/512/4103/4103111.png ";
  imagenBotonEditar.className = "imagenesBotones";
  //Función de Editar Tareas
  imagenBotonEditar.addEventListener("click", function () {
    //mostar el formulario de editar
    formularioEditar.classList.remove("oculto");
    // Asigno al indice Editando el index que viene de cuando hacemos click al boton de editar, para ocuparlo en otra función, este viende de la funcion MostrarLista -> CrearElementoLista
    console.log("index recibido en el boton editar " + index)
    indiceEditando = index;
    console.log("indice editando valor asignado: " + indiceEditando)
    // Le asigno al input del formulario Editar el nombre de la tarea que seleccione para editar, y esa tarea viene del objeto que se le paso a esta funcion
    document.getElementById("nombreTareaEditar").value = tarea.name;
    document.getElementById("descripcionTareaEditar").value = tarea.descripcion;
    document.getElementById("fechaTareaEditar").value = tarea.fecha;
    document.getElementById("opcionesFiltrosEditar").value = tarea.filtro;
    //ocultar el formulario de editar cuando le de cancelar
  });
  return imagenBotonEditar;
}

// Función que se activa cuando se da click en el boton de cancelar en el formulario de editar una tarea
function cancelarEdicion() {
  formularioEditar.classList.add("oculto");
  indiceEditando = null; // Como se cancela la edicion borrar el indice que se guardo;
}

// Función que guarda la Tarea que se ha editado
function guardarTareaEditada(event) {
  event.preventDefault();
  console.log(indiceEditando)
  if (indiceEditando !== null) {
    //guardar el nuevo nombre de la tarea
    const nombreTareaEditado =
      document.getElementById("nombreTareaEditar").value;
   
    tareas[indiceEditando].name = nombreTareaEditado;
    console.log(tareas[indiceEditando].name)
    // Guardar la nueva descripción de la tarea
    const descripcionTareaEditar = document.getElementById(
      "descripcionTareaEditar"
    ).value;
    tareas[indiceEditando].descripcion = descripcionTareaEditar;
    // Guardar la nueva fecha de la tarea
    const fechaTareaEditado = document.getElementById("fechaTareaEditar").value;
    tareas[indiceEditando].fecha = fechaTareaEditado;
    // Guardar la nueva opción de filtro de la tarea
    const opcionNuevaFiltro = document.getElementById(
      "opcionesFiltrosEditar"
    ).value;
    tareas[indiceEditando].filtro = opcionNuevaFiltro;
    formularioEditar.classList.add("oculto");
    // Como se acaba de editar un objeto del arreglo tareas, lo envio de nuevo al LocalStorage para que se actualice
    localStorage.setItem("tareas", JSON.stringify(tareas));
    mostrarTareasHoy(tareas); // Vuelvo a mostrar la lista actualizada
    indiceEditando = null; // Como ya se edito, volver a dejar el indice del arreglo null para otras ediciones
  }
}

const formularioEditar = document.getElementById("fondoOscuroEditar");
formularioEditar.classList.add("oculto");

// Lógica de mostrar los filtros en los formularios tanto de crear una nueva tarea como de editarla
const selectFiltroEditarFormularioTareasHoy = document.getElementById("opcionesFiltrosEditar");

var arregloFiltros = JSON.parse(localStorage.getItem("filtros")) || [];

arregloFiltros.forEach(function (filtro) {
  // Función para devolver el texto con emoji
  function getTextoConEmoji(nombre) {
    switch (nombre) {
      case "Prioridad 1":
        return "🔴 " + nombre;
      case "Prioridad 2":
        return "🟠 " + nombre;
      case "Prioridad 3":
        return "🔵 " + nombre;
      case "Prioridad 4":
        return "🟢 " + nombre;
      default:
        return nombre;
    }
  }


  // --- Para el select de editar ---
  const opcionFiltrosEditarTarea = document.createElement("option");
  opcionFiltrosEditarTarea.value = filtro.nombre; // limpio
  opcionFiltrosEditarTarea.textContent = getTextoConEmoji(filtro.nombre);
  selectFiltroEditarFormularioTareasHoy.appendChild(opcionFiltrosEditarTarea);
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



// ---------------------------✅ Validación de que la tarea tenga al menos el nombre antes agregar-------------------
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

//-------- Parte del codigo que sirve como validación para la fecha, solo fecha actual-----------
// Obtener la fecha de hoy en formato YYYY-MM-DD
const hoy = new Date();
const yyyy = hoy.getFullYear();
const mm = String(hoy.getMonth() + 1).padStart(2, "0");
const dd = String(hoy.getDate()).padStart(2, "0");
const fechaHoy = `${yyyy}-${mm}-${dd}`;

// Seleccionar todos los input[type="date"]
const inputsFecha = document.querySelectorAll('input[type="date"]');

// Asignar min a cada uno
inputsFecha.forEach((input) => {
  input.min = fechaHoy;
});