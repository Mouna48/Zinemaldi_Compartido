/*  CRUD completo de Emisiones contra la API REST de Directus.*/

/*  CONFIGURACIÓN  */
const URL_BASE = "http://localhost:8055/items/emision";
const TOKEN    = "uos622sC0nh7KSaHtrFvTDetI__wl15z"; 


/*  REFERENCIAS AL DOM */
const formulario        = document.getElementById("form-emision");
const tituloFormulario  = document.getElementById("titulo-formulario");
const inputId           = document.getElementById("emision-id");
const inputFecha        = document.getElementById("fecha");
const inputHora         = document.getElementById("hora");
const inputIdPelicula   = document.getElementById("id_pelicula");
const inputIdSala       = document.getElementById("id_sala");
const btnGuardar        = document.getElementById("btn-guardar");
const btnCancelar       = document.getElementById("btn-cancelar");
const cajaListado       = document.getElementById("listado-items");
const estadoCargando    = document.getElementById("estado-cargando");
const estadoError       = document.getElementById("estado-error");
const mensajeFormulario = document.getElementById("mensaje-formulario");


/*  LISTAR (GET)  */
async function cargarEmisiones() {

    estadoCargando.classList.remove("oculto");
    estadoError.classList.add("oculto");
    cajaListado.innerHTML = "";

    try {
        const respuesta = await fetch(URL_BASE, {
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${TOKEN}`
            }
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.json();
            throw new Error("Error al llamar a la API: " + respuesta.status + ":" + mensajeError.errors[0].message);
        }

        const datos = await respuesta.json();
        const emisiones = datos.data;

        estadoCargando.classList.add("oculto");

        if (emisiones.length === 0) {
            cajaListado.innerHTML = "<p class='estado'>No hay emisiones registradas todavía.</p>";
        } else {
            pintarEmisiones(emisiones);
        }

    } catch (error) {
        console.error(error);
        estadoCargando.classList.add("oculto");
        estadoError.textContent = "No se han podido cargar las emisiones. " + error.message;
        estadoError.classList.remove("oculto");
    }
}


/*  PINTAR LAS TARJETAS */
function pintarEmisiones(emisiones) {
    cajaListado.innerHTML = "";

    emisiones.forEach(e => {
        const card = document.createElement("article");
        card.className = "card-item";

        card.innerHTML = `
            <h3>Emisión #${e.IDEmision}</h3>
            <p><strong>Fecha:</strong> ${e.Fecha || "-"}</p>
            <p><strong>Hora:</strong> ${e.Hora || "-"}</p>
            <p><strong>ID Película:</strong> ${e.IDPelicula || "-"}</p>
            <p><strong>ID Sala:</strong> ${e.IDSala || "-"}</p>
            <div class="acciones-card">
                <button class="btn-editar" data-id="${e.IDEmision}">Editar</button>
                <button class="btn-borrar" data-id="${e.IDEmision}">Borrar</button>
            </div>
        `;

        cajaListado.appendChild(card);
    });

    document.querySelectorAll(".btn-editar").forEach(b => {
        b.addEventListener("click", () => prepararEdicion(b.dataset.id));
    });
    document.querySelectorAll(".btn-borrar").forEach(b => {
        b.addEventListener("click", () => borrarEmision(b.dataset.id));
    });
}


/*  CREAR (POST) y ACTUALIZAR (PATCH)  */
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    ocultarMensaje();

    if (!inputFecha.value || !inputHora.value || !inputIdPelicula.value || !inputIdSala.value) {
        mostrarMensaje("Rellena todos los campos obligatorios.", "error");
        return;
    }

    /*  las claves del objeto deben coincidir EXACTAMENTE con los nombres
       de las columnas en la base de datos, mayúsculas incluidas. */
    const datos = {
        Fecha:      inputFecha.value,
        Hora:       inputHora.value,
        IDPelicula: parseInt(inputIdPelicula.value, 10),
        IDSala:     parseInt(inputIdSala.value, 10)
    };

    const idActual = inputId.value;

    try {
        let respuesta;

        if (idActual) {
            // ----- ACTUALIZAR (PATCH) -----
            respuesta = await fetch(`${URL_BASE}/${idActual}`, {
                method: "PATCH",
                headers: {
                    "Content-Type":  "application/json",
                    "Authorization": `Bearer ${TOKEN}`
                },
                body: JSON.stringify(datos)
            });
        } else {
            // ----- CREAR (POST) -----
            respuesta = await fetch(URL_BASE, {
                method: "POST",
                headers: {
                    "Content-Type":  "application/json",
                    "Authorization": `Bearer ${TOKEN}`
                },
                body: JSON.stringify(datos)
            });
        }

        if (!respuesta.ok) {
            const mensajeError = await respuesta.json();
            throw new Error("Error al llamar a la API: " + respuesta.status + ":" + mensajeError.errors[0].message);
        }

        mostrarMensaje(idActual ? "Emisión actualizada correctamente." : "Emisión creada correctamente.", "ok");
        resetearFormulario();
        cargarEmisiones();

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se ha podido guardar la emisión. " + error.message, "error");
    }
});


/*  PREPARAR EDICIÓN  */
async function prepararEdicion(id) {
    ocultarMensaje();

    try {
        const respuesta = await fetch(`${URL_BASE}/${id}`, {
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${TOKEN}`
            }
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.json();
            throw new Error("Error al llamar a la API: " + respuesta.status + ":" + mensajeError.errors[0].message);
        }

        const datos = await respuesta.json();
        const e = datos.data;

        inputId.value         = e.IDEmision;
        inputFecha.value      = e.Fecha      || "";
        // Cortamos los segundos si Directus devuelve la hora como "18:00:00"
        inputHora.value       = e.Hora ? e.Hora.substring(0, 5) : "";
        inputIdPelicula.value = e.IDPelicula || "";
        inputIdSala.value     = e.IDSala     || "";

        tituloFormulario.textContent = "Editando emisión #" + e.IDEmision;
        btnGuardar.textContent       = "Actualizar";
        btnCancelar.classList.remove("oculto");

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al cargar la emisión. " + error.message, "error");
    }
}


/*  CANCELAR EDICIÓN  */
btnCancelar.addEventListener("click", resetearFormulario);


/*  BORRAR (DELETE) */
async function borrarEmision(id) {

    if (!confirm("¿Seguro que quieres borrar esta emisión?")) return;

    try {
        const respuesta = await fetch(`${URL_BASE}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${TOKEN}`
            }
        });

        if (!respuesta.ok && respuesta.status !== 204) {
            const mensajeError = await respuesta.json();
            throw new Error("Error al llamar a la API: " + respuesta.status + ":" + mensajeError.errors[0].message);
        }

        mostrarMensaje("Emisión eliminada.", "ok");
        cargarEmisiones();

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se ha podido borrar la emisión. " + error.message, "error");
    }
}


/*  9. UTILIDADES  */
function resetearFormulario() {
    formulario.reset();
    inputId.value                = "";
    tituloFormulario.textContent = "Añadir nueva emisión";
    btnGuardar.textContent       = "Guardar";
    btnCancelar.classList.add("oculto");
}

function mostrarMensaje(texto, tipo) {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.className   = "mensaje " + tipo;
}

function ocultarMensaje() {
    mensajeFormulario.classList.add("oculto");
    mensajeFormulario.textContent = "";
}


/* 10. ARRANQUE  */
cargarEmisiones();