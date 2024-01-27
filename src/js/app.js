let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: "",
    nombre: "",
    fecha: "",
    hora: "",
    servicios: []
};

document.addEventListener("DOMContentLoaded", function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion();        // Muestra y oculta las secciones
    tabs();                  // Cambia la sección cuando se presionen los tabs
    botonesPaginador();      // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI();          // Consulta la API en el backend de PHP

    nombreCliente();         // Añade el nombre del cliente al objeto de cita
    idCliente();             // Añade el nombre del cliente al objeto de cita

    seleccionarFecha();      // Añade la fecha de la cita en el objeto
    seleccionarHora();       // Añade la hora de la cita en el objeto

    mostrarResumen();        // Muestra el resumen de la cita
}

function mostrarSeccion() {
    // Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector(".mostrar");
    if(seccionAnterior) {
        seccionAnterior.classList.remove("mostrar");
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add("mostrar");

    // Quita la clase de tab al tab anterior
    const tabAnterior = document.querySelector(".actual");
    if(tabAnterior) {
        tabAnterior.classList.remove("actual");
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add("actual");
}

function tabs() {
    const botones = document.querySelectorAll(".tabs button");
    botones.forEach( boton => {
        boton.addEventListener("click", function(e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();

            botonesPaginador();
        });
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");

    if(paso === 1) {
        paginaAnterior.classList.add("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    } else if(paso === 3) {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.add("ocultar");
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion();
    mostrarResumen();

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", function() {

        if(paso <= pasoInicial) return;
        paso--;
        
        botonesPaginador()
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", function() {

        if(paso >= pasoFinal) return;
        paso++;
        
        botonesPaginador()
    });
}

async function consultarAPI() {
    try {
        // const url = `${location.origin}/api/servicios`;
        const url = "/api/servicios";
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;          // Destructuring, extrae el valor y crea la variable al mismo tiempo

        const nombreServicio = document.createElement("P");
        nombreServicio.classList.add("nombre-servicio");
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.classList.add("precio-servicio");
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement("DIV");
        servicioDiv.classList.add("servicio");
        servicioDiv.dataset.idServicio = id;            // Atributo personalizado, en consola se ve como:    data-id-servicio
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector("#servicios").appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const {id} = servicio;
    const {servicios} = cita;       // Extraemos "servicios" del arreglo de cita que tenemos en la parte superior del archivo

    // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado
    if(servicios.some(agreagado => agreagado.id === id)) {
        // Si ya está agregado, lo eliminamos al dar click
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove("seleccionado");                                                
    } else {
        // Si no está, lo agregamos al dar click
        cita.servicios = [...servicios, servicio];      // Spread operator (...), toma una copia de lo que hay en el arreglo y agrega el
                                                        // nuevo objeto, creando así un solo arreglo y lo reescribe en "cita.servicio"
        divServicio.classList.add("seleccionado");                                                
    }

    // console.log(cita);
}

function nombreCliente() {
    cita.nombre = document.querySelector("#nombre").value;     // Lo que para html es un atributo, para js es un objeto
}

function idCliente() {
    cita.id = document.querySelector("#id").value;             // Lo que para html es un atributo, para js es un objeto
}

function seleccionarFecha() {
    const inputFecha = document.querySelector("#fecha");
    inputFecha.addEventListener("input", function(e) {
        
        const dia = new Date(e.target.value).getUTCDay();

        if([6, 0].includes(dia)) {
            e.target.value = "";
            mostrarAlerta("Fines de semana no permitidos", "error", ".formulario");
        } else {
            cita.fecha = e.target.value;
        }
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", function(e) {

        const horaCita = e.target.value;
        const hora = horaCita.split(":") [0];
        
        if(hora < 10 || hora > 20) {
            e.target.value = "";
            mostrarAlerta("Nuestro horario de atención es de 10hs a 20hs", "error", ".formulario");
        } else {
            cita.hora = e.target.value;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    // Previene que se generen varias alertas
    const alertaPrevia = document.querySelector(".alerta");
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    // Srcipting para crear la alerta
    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        // Eliminar la alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector(".contenido-resumen");

    // Limpiar el contenido del resumenn
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes("") || cita.servicios.length === 0) {
        mostrarAlerta("Completa todos los campos requeridos para continuar", "error", ".contenido-resumen", false);

        return;
    }

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para Servicios en Resumen
    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de Servicio(s)";
    resumen.appendChild(headingServicios);


    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const {id, precio, nombre} = servicio;

        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    // Heading para Cita en Resumen
    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de Cita";
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement("P");
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // // Formatear la fecha 
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();
    const fechaUTC = new Date(Date.UTC(year, mes, dia)); // Corrección aquí
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;


    // Sumar el coste total de los servicios (si el cliente elije más de uno)
    const total = servicios.reduce((total, servicio) => total + parseFloat(servicio.precio), 0);
    const totalParrafo = document.createElement("P");
    totalParrafo.innerHTML = `<span>Total:</span> $${total}.00`;

    // Boton para crear una cita
    const botonReservar = document.createElement("BUTTON");
    botonReservar.classList.add("boton");
    botonReservar.textContent = "Reservar Cita";
    botonReservar.onclick = reservarCita;       // Cuando asociamos un evento de esta forma, no le ponemos los paréntesis a la función
                                                // ya que manda llamar a la función, si queremos pasarle un parámetro, usamos callback
    //

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(totalParrafo);
    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    const { id, fecha, hora, servicios } = cita;

    const idServicios = servicios.map( servicio => servicio.id );

    const datos = new FormData();       // Actua como submit, con Javascript, hay que comunicarlo hacia una API, creando una URL 
    datos.append("usuarioId", id);
    datos.append("fecha", fecha);
    datos.append("hora", hora);
    datos.append("servicios", idServicios)

    // console.log([...datos]);

    try {
        // Petición hacia la API
        // const url = `${location.origin}/api/citas`;
        const url = "/api/citas";
        const respuesta = await fetch(url, {
            method: "POST",      // va hacia la url, hacia la api de de citas (guardar, en index) hacia el controlador api
            body: datos
        });
    
        const resultado = await respuesta.json();
        console.log(resultado.resultado);
    
        if(resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
                button: "OK"
            }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita"
        });
    }
}