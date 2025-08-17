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
// Crear un arreglo de las tareas completadas con los datos en la clave "tareasCompletadas" del localStorage
var tareasCompletadasArreglo =
  JSON.parse(localStorage.getItem("tareasCompletadas")) || [];
// indice del array que quiero editar
let indiceEditando = null;

// Obtengo el evento de agregar una nueva tarea que es el boton de la bandeja de entrada
document
  .getElementById("nuevaTarea")
  .addEventListener("click", agregarNuevaTarea);
// Captura el evento para guardar una tarea que fue editada
document
  .getElementById("guardarTarea")
  .addEventListener("click", guardarTareaEditada);
// Captura del evento para cancelar el formulario de editar
document
  .getElementById("desaparecerFormularioEditar")
  .addEventListener("click", cancelarEdicion);

// Función para agregar una nueva tarea, recolecta los datos de los input
// Crear un objeto con los datos recolectados y los agregar al arreglo tareas
// Por ultimo envia al arreglo al localStorage con la clave "tareas"
function agregarNuevaTarea(event) {
  event.preventDefault();
  // Obtengo el valor del nombre de la tarea
  const nombreTarea = document.getElementById("nombreTarea").value;
  // Obtengo el valor de decripción de la tarea
  const descripcionTarea = document.getElementById("descripcionTarea").value;
  // Obtengo el valor de la fecha de la tarea
  const fechaTarea = document.getElementById("fechaTarea").value;
  // Creando un objeto Tarea con sus valores que requiere
  const tarea = new Tarea(nombreTarea, descripcionTarea, fechaTarea);
  // Agrego la nueva tarea(objeto) al arreglo tareas
  tareas.push(tarea);
  // Envio el arreglo tareas al localStorage con clave "tareas"
  localStorage.setItem("tareas", JSON.stringify(tareas));
  // Llamo a la faunción para limipiar el formulario de Nueva Tarea
  limpiarFormularioNuevaTarea();
  // LLamo a la función mostrar tareas y le paso el arreglo tareas que contiene la tarea(objeto)
  mostrarTareas(tareas);
  h1bandejaEntrada.classList.remove("oculto");
}

//Función para limpiar los input del formulario de Nueva Tarea
function limpiarFormularioNuevaTarea() {
  document.getElementById("nombreTarea").value = "";
  document.getElementById("descripcionTarea").value = "";
  document.getElementById("fechaTarea").value = "";
}

// Función para Mostrarlas en la interfaz
// Creo un elmento con create element y lo paso al padre que es listaTareas que es un UL en el HTML
function mostrarTareas(arregloTareas) {
  const listaTareas = document.getElementById("listaTareas");
  listaTareas.innerHTML = ""; // Limpiar lista antes de mostrar
  //Recorro cada elemento del arreglo, los parametros function(tarea, index)
  // tarea es cada elemento dentro del arreglo, y el index es la posición del elemento en el arreglo
  arregloTareas.forEach(function (tarea, index) {
    listaTareas.appendChild(crearElementoTarea(tarea, index));
  });
  // Actualizar la interfaz si esta vacio o si no esta vacio el arreglo de lista de tareas
  if (!arregloTareas.length) {
    bandejaEntrada.classList.remove("oculto");
    h1bandejaEntrada.classList.add("oculto");
    añadirtareaoculto.classList.add("oculto");
    formulario.classList.add("oculto");
  } else {
    bandejaEntrada.classList.add("oculto");
    h1bandejaEntrada.classList.remove("oculto");
    if (formulario.classList.contains("oculto")) {
      añadirtareaoculto.classList.remove("oculto");
    }
  }
}

// Función para crear el Elemento Tarea que es li con los botones
// Esta función llama a otros funciones que crean los botones de editar y completar
// Recibe 2 parametros tarea (es cada elemento del array) y el index que es el numero de index del objeto del array
function crearElementoTarea(tarea, index) {
  // Creo el elemento li para la nueva tarea, se le asigna una clase de css
  const nuevaTarea = document.createElement("li");
  nuevaTarea.className = "claseTareas";
  // Creo un div en el que ira el nombre y fecha de la tarea, cada uno con un p
  const contenedorTarea = document.createElement("div");
  contenedorTarea.className = "contenedorListaTarea";
  // Crear un P para mostrar el nombre de la tarea
  const nombreTareaP = document.createElement("p");
  nombreTareaP.textContent = tarea.name;
  // Crear un P para mostrar la fecha de la tarea
  const fechaTareaP = document.createElement("p");
  fechaTareaP.className = "fechaTarea";
  // Llamo a la función que me va a dar el un nuevo formato para mostrar la fecha
  const fechaAMostrar = nuevoFormatoFechaTarea(tarea.fecha);
  // Llamo a la función que me dara el final, que es con el nuevo formato y el color correspondiente de acuerdo a la fecha
  const fechaConColor = colorFechaMostrar(fechaAMostrar);
  // Creo elemento imagen que acompaña a la fecha (calendario)
  const imagenFechaTarea = document.createElement("img");
  imagenFechaTarea.src =
    "https://cdn-icons-png.flaticon.com/512/661/661512.png";
  imagenFechaTarea.className = "imagenesBotonesFecha";
  // Creo un div(flex) para unir la imagen y la fecha
  const divFechaImagenTarea = document.createElement("div");
  divFechaImagenTarea.className = "imagenytextofecha";
  divFechaImagenTarea.appendChild(imagenFechaTarea);
  divFechaImagenTarea.appendChild(fechaConColor);
  // uno los elementos hijos (nombre ye fecha) al padre (div que los contiene)
  contenedorTarea.appendChild(nombreTareaP);
  // condicional, el de mostar o no fecha (ayuda al estilo)
  if (tarea.fecha !== "") {
    contenedorTarea.appendChild(divFechaImagenTarea);
  }
  // Crea el div donde van a estar los botones de completar y editar, y se les asigna una clase de css
  const divBotones = document.createElement("div");
  divBotones.className = "divBotones";
  // Creo el boton de completar llamando a la funcion y pasandole el index
  const botonCompletar = crearBotonCompletar(index);
  // Creo el boton de editar llamando a la funcion y pasandole el objeto tarea y el index
  const botonEditar = crearBotonEditar(tarea, index);
  // Uno los elemento padre al hijo
  divBotones.appendChild(botonCompletar);
  divBotones.appendChild(botonEditar);
  nuevaTarea.appendChild(contenedorTarea);
  nuevaTarea.appendChild(divBotones);
  // retornamos el elemento li con todo sus propiedades
  return nuevaTarea;
}

//Función para personalizar el formato de la fecha
function nuevoFormatoFechaTarea(fecha) {
  const [anioSeleccionado, mesSeleccionado, diaSeleccionado] = fecha
    .split("-")
    .map(Number);

  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1;
  const diaActual = fechaActual.getDate();

  // Crear fecha en hora local para evitar desfase
  const fechaSeleccionada = new Date(
    anioSeleccionado,
    mesSeleccionado - 1,
    diaSeleccionado
  );

  let idioma = "es-ES";
  let opciones = {};
  let textoFecha = "";

  // Función para obtener número de semana ISO
  function getWeekNumber(date) {
    const tmp = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const diaSemana = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - diaSemana);
    const inicioAno = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil(((tmp - inicioAno) / 86400000 + 1) / 7);
  }

  // Mismo mes y año
  if (mesSeleccionado === mesActual && anioSeleccionado === anioActual) {
    if (diaSeleccionado === diaActual) {
      return "Hoy";
    } else if (diaSeleccionado === diaActual + 1) {
      return "Mañana";
    } else {
      // Comparar semana
      if (getWeekNumber(fechaSeleccionada) === getWeekNumber(fechaActual)) {
        opciones = { weekday: "long" }; // Solo el día de la semana
        textoFecha = fechaSeleccionada.toLocaleDateString(idioma, opciones);
      } else {
        idioma = "en-US";
        opciones = { month: "short", day: "numeric" }; // Mes + día numérico
        textoFecha = fechaSeleccionada
          .toLocaleDateString(idioma, opciones)
          .replace(",", "")
          .replace(".", "");
      }
    }
  }
  // Mismo año, distinto mes
  else if (anioSeleccionado === anioActual) {
    idioma = "en-US";
    opciones = { month: "short", day: "numeric" };
    textoFecha = fechaSeleccionada
      .toLocaleDateString(idioma, opciones)
      .replace(",", "")
      .replace(".", "");
  }
  // Distinto año
  else {
    idioma = "en-US";
    opciones = { month: "short", day: "numeric", year: "numeric" };
    textoFecha = fechaSeleccionada
      .toLocaleDateString(idioma, opciones)
      .replace(",", "")
      .replace(".", "");
  }
  // Mayúscula inicial
  return textoFecha.charAt(0).toUpperCase() + textoFecha.slice(1);
}

// Función que dependiendo del retorno de la función nuevoFormatoFechaTarea, me dara un color para el p u otro
function colorFechaMostrar(textoFecha) {
  const p = document.createElement("p");
  p.textContent = textoFecha;
  if (textoFecha === "Hoy") {
    p.className = "claseHoy";
  } else if (textoFecha === "Mañana") {
    p.className = "claseMañana";
  } else if (
    textoFecha === "Lunes" ||
    textoFecha === "Martes" ||
    textoFecha === "Miercoles" ||
    textoFecha === "Jueves" ||
    textoFecha === "Sabado" ||
    textoFecha === "Domingo"
  ) {
    p.className = "claseDiaSemana";
  } else {
    p.className = "fechaTarea";
  }
  return p;
}

// Función para crear el boton de completar, crea el elemento y además la función del botón
function crearBotonCompletar(index) {
  const imagenBotonCompletado = document.createElement("img");
  imagenBotonCompletado.src =
    "https://cdn-icons-png.flaticon.com/512/2782/2782895.png";
  imagenBotonCompletado.className = "imagenesBotones";
  //Función de para el completar las tareas
  imagenBotonCompletado.addEventListener("click", function () {
    // Eliminar del array y crea un nuevo array que es el que voy a mostrar con completadas, el index viene de la funcion mostrarLista -> crearElementoLista
    // agrego al arreglo de Tareas Completadas el elemento que se acaba de eliminar del arreglo de tareas
    tareasCompletadasArreglo.push(tareas.splice(index, 1)[0]);
    // Envio ese nuevo arreglo para que se sobreescriba el que ya estaba en el LocalStorage, haciendo que se guarde la nueva tarea completada
    localStorage.setItem(
      "tareasCompletadas",
      JSON.stringify(tareasCompletadasArreglo)
    );
    // Actualizo el arreglo tareas en el LocalStorage
    localStorage.setItem("tareas", JSON.stringify(tareas));
    // Volver a mostrar lista actualizada, el tareas llamado es el array que esta fuera, este tareas es el que esta definido al principio del codigo
    mostrarTareas(tareas);
  });
  return imagenBotonCompletado;
}

// Función de crear el boton de editar
function crearBotonEditar(tarea, index) {
  const imagenBotonEditar = document.createElement("img");
  imagenBotonEditar.src =
    "https://cdn-icons-png.flaticon.com/512/4103/4103111.png ";
  imagenBotonEditar.className = "imagenesBotones";
  //Función de Editar Tareas
  imagenBotonEditar.addEventListener("click", function () {
    //ocultar el formulario de crear
    formulario.classList.add("oculto");
    //mostar el formulario de editar
    formularioEditar.classList.remove("oculto");
    // Asigno al indice Editando el index que viene de cuando hacemos click al boton de editar, para ocuparlo en otra función, este viende de la funcion MostrarLista -> CrearElementoLista
    indiceEditando = index;
    // Le asigno al input del formulario Editar el nombre de la tarea que seleccione para editar, y esa tarea viene del objeto que se le paso a esta funcion
    document.getElementById("nombreTareaEditar").value = tarea.name;
    document.getElementById("descripcionTareaEditar").value = tarea.descripcion;
    document.getElementById("fechaTareaEditar").value = tarea.fecha;
    //ocultar el formulario de editar cuando le de cancelar
  });
  return imagenBotonEditar;
}

function cancelarEdicion() {
  formularioEditar.classList.add("oculto");
  indiceEditando = null; // Como se cancela la edicion borrar el indice que se guardo;
}

// Función que guarda la Tarea que se ha editado
function guardarTareaEditada(event) {
  event.preventDefault();
  if (indiceEditando !== null) {
    //guardar el nuevo nombre de la tarea
    const nombreTareaEditado =
      document.getElementById("nombreTareaEditar").value;
    tareas[indiceEditando].name = nombreTareaEditado;
    // Guardar la nueva descripción de la tarea
    const descripcionTareaEditar = document.getElementById(
      "descripcionTareaEditar"
    ).value;
    tareas[indiceEditando].descripcion = descripcionTareaEditar;
    // Guardar la nueva fecha de la tarea
    const fechaTareaEditado = document.getElementById("fechaTareaEditar").value;
    tareas[indiceEditando].fecha = fechaTareaEditado;
    formularioEditar.classList.add("oculto");
    añadirtareaoculto.classList.remove("oculto");
    // Como se acaba de editar un objeto del arreglo tareas, lo envio de nuevo al LocalStorage para que se actualice
    localStorage.setItem("tareas", JSON.stringify(tareas));
    mostrarTareas(tareas); // Vuelvo a mostrar la lista actualizada
    indiceEditando = null; // Como ya se edito, volver a dejar el indice del arreglo null para otras ediciones
  }
}

// Logico de ocultar y mostrar elementos de la interfaz
const formulario = document.getElementById("formulario-tareas");
const formularioEditar = document.getElementById("fondoOscuroEditar");
const bandejaEntrada = document.getElementById("bandeja");
const h1bandejaEntrada = document.getElementById("h1bandejaEntrada");
const añadirtareaoculto = document.getElementById("añadirtareaoculto");

formulario.classList.add("oculto");
formularioEditar.classList.add("oculto");
h1bandejaEntrada.classList.add("oculto");
añadirtareaoculto.classList.add("oculto");

// capturo el evento del boton añadir tarea que esta debajo de bandeja de entrada (cuando no hay tareas almacenadas)
document
  .getElementById("aparecerFormulario")
  .addEventListener("click", function () {
    bandejaEntrada.classList.add("oculto");
    formulario.classList.remove("oculto");
  });

// Capturo el evento del boton cancelar del formulario para añadir una nueva tarea
document
  .getElementById("desaparecerFormulario")
  .addEventListener("click", function () {
    formulario.classList.add("oculto");
    limpiarFormularioNuevaTarea();
    if (!tareas.length) {
      bandejaEntrada.classList.remove("oculto");
    } else {
      añadirtareaoculto.classList.remove("oculto");
    }
  });

// Capturo el evento del boton añadir tarea que aparece al finalizar la lista de tareas
document
  .getElementById("añadirtareaoculto")
  .addEventListener("click", function () {
    formulario.classList.remove("oculto");
    añadirtareaoculto.classList.add("oculto");
  });

// Capturo el evento del añadirTarea que esta en el menu
document
  .getElementById("iconoañadirTarea")
  .addEventListener("click", function () {
    formulario.classList.remove("oculto");
    bandejaEntrada.classList.add("oculto");
  });

// Verificación inicial, por si hay tareas en el LocalStorage
if (tareas.length !== 0) {
  document.addEventListener("DOMContentLoaded", () => mostrarTareas(tareas));
  bandejaEntrada.classList.add("oculto");
  formulario.classList.add("oculto");
  formularioEditar.classList.add("oculto");
  añadirtareaoculto.classList.add("oculto");
} else {
  bandejaEntrada.classList.remove("oculto");
}
