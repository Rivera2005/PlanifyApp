// Captura el evento de cargar el Dom y llama a la función que mostrara las tareas completadas
document.addEventListener("DOMContentLoaded", tareasCompletadas);
// Función que se llama al cargar el Dom que llama a la función de mostrarTareasCompletadas
function tareasCompletadas(event) {
  event.preventDefault();
  const tareasCompletadas =
    JSON.parse(localStorage.getItem("tareasCompletadas")) || [];
  mostrarTareasCompletadas(tareasCompletadas);
}
// Función que llama a todos los elementos necesarios para crear el li de la tarea
function mostrarTareasCompletadas(arregloTareas) {
  // Llamar al ul que almacena la lista de tareas
  const listaTareasCompletadas = document.getElementById(
    "listaTareasCompletadas"
  );
  listaTareasCompletadas.innerHTML = ""; // Limpiar lista antes de mostrar

  // Agrupar tareas pro fecha de completado
  const tareasPorFecha = {};

  arregloTareas.forEach((tarea) => {
    // Extraer solo la parte de la fecha (antes de la coma)
    const [fechaCorta] = tarea.completadaEn.split(",");
    if (!tareasPorFecha[fechaCorta]) {
      tareasPorFecha[fechaCorta] = [];
    }
    tareasPorFecha[fechaCorta].push(tarea);
  });

  // Recorrer fechas en orden descendente (más recientes primero)
  const fechasOrdenadas = Object.keys(tareasPorFecha).sort((a, b) => {
    const [da, ma, ya] = a.split("/").map(Number);
    const [db, mb, yb] = b.split("/").map(Number);
    return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
  });

  fechasOrdenadas.forEach((fechaCorta) => {
    // --- Formato "Ago 15 ‧ viernes" ---
    const [dia, mes, anio] = fechaCorta.split("/").map(Number);
    const fechaObj = new Date(anio, mes - 1, dia);

    const opcionesMes = { month: "short" };
    const opcionesDiaSemana = { weekday: "long" };

    const mesAbrev = fechaObj.toLocaleDateString("es-ES", opcionesMes); // "ago"
    const diaNum = fechaObj.getDate(); // 15
    const diaSemana = fechaObj.toLocaleDateString("es-ES", opcionesDiaSemana); // "viernes"

    const tituloFecha = document.createElement("h4");
    tituloFecha.textContent = `${
      mesAbrev.charAt(0).toUpperCase() + mesAbrev.slice(1)
    } ${diaNum} ‧ ${diaSemana}`;
    tituloFecha.className = "tituloFechaGrupo";

    listaTareasCompletadas.appendChild(tituloFecha);

    // Crear lista de tareas de esa fecha
    const ulGrupo = document.createElement("ul");
    ulGrupo.className = "grupoTareas";

    tareasPorFecha[fechaCorta].forEach((tarea) => {
      ulGrupo.appendChild(crearElementoTareaCompletada(tarea));
    });

    listaTareasCompletadas.appendChild(ulGrupo);
  });
}

// Crea el elemento tarea
function crearElementoTareaCompletada(tarea) {
  // Creo el elemento li para la nueva tarea, se le asigna una clase de css
  const nuevaTarea = document.createElement("li");
  nuevaTarea.className = "claseTareas";
  nuevaTarea.id = "tareacompleatada";
  // Creo un div en el que ira el nombre y fecha de la tarea, cada uno con un p
  const contenedorTarea = document.createElement("div");
  contenedorTarea.className = "contenedorListaTarea";
  // Elemento p que llevara el nombre de la tarea Completada
  const nombreTareaP = document.createElement("p");
  nombreTareaP.innerHTML =
    "<strong style='font-size:15px;'>Tú</strong> " +
    '<span style="color:#202020; opacity:0.7; font-size:13.9px;">completaste una tarea:</span> ' +
    "<u>" +
    tarea.name +
    "</u>";
  // Extraer hora:minuto de completadaEn
  const horaMinuto = tarea.completadaEn.split(",")[1].trim(); // "8:14:57 p.m."
  const horaCorta =
    horaMinuto.split(":")[0] +
    ":" +
    horaMinuto.split(":")[1] +
    (horaMinuto.includes("a.m.") ? " am" : " pm");
  //Creo el elemento p que lleva la fecha
  const horaP = document.createElement("p");
  horaP.className = "horaCompletada";
  horaP.textContent = horaCorta;
  // Añadir al contenedor
  contenedorTarea.appendChild(nombreTareaP);
  contenedorTarea.appendChild(horaP);

  nuevaTarea.appendChild(contenedorTarea);
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
