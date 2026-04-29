/* CRUD completo de Salas */
/* CONFIGURACIÓN  */
const URL_BASE = "http://localhost:8055/items/sala";
const TOKEN    = "OYxtn1U7wdud0JfKVNDs4yULVKAcejZp"; 


/* REFERENCIAS AL DOM  */
const formulario        = document.getElementById("form-sala");
const tituloFormulario  = document.getElementById("titulo-formulario");
const inputId           = document.getElementById("sala-id");
const inputNombre       = document.getElementById("nombre");
const inputCapacidad    = document.getElementById("capacidad");
const btnGuardar        = document.getElementById("btn-guardar");
const btnCancelar       = document.getElementById("btn-cancelar");
const cajaListado       = document.getElementById("listado-items");
const estadoCargando    = document.getElementById("estado-cargando");
const estadoError       = document.getElementById("estado-error");
const mensajeFormulario = document.getElementById("mensaje-formulario");


/*  LISTAR (GET) */
async function cargarSalas() {

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
        const salas = datos.data;

        estadoCargando.classList.add("oculto");

        if (salas.length === 0) {
            cajaListado.innerHTML = "<p class='estado'>No hay salas registradas todavía.</p>";
        } else {
            pintarSalas(salas);
        }

    } catch (error) {
        console.error(error);
        estadoCargando.classList.add("oculto");
        estadoError.textContent = "No se han podido cargar las salas. " + error.message;
        estadoError.classList.remove("oculto");
    }
}


/*  PINTAR LAS TARJETAS  */
function pintarSalas(salas) {
    cajaListado.innerHTML = "";

    salas.forEach(s => {
        const card = document.createElement("article");
        card.className = "card-item";

        card.innerHTML = `
            <h3>${s.Nombre || "(Sin nombre)"}</h3>
            <p><strong>Capacidad:</strong> ${s.Capacidad || "-"} personas</p>
            <div class="acciones-card">
                <button class="btn-editar" data-id="${s.IDSala}">Editar</button>
                <button class="btn-borrar" data-id="${s.IDSala}">Borrar</button>
            </div>
        `;

        cajaListado.appendChild(card);
    });

    document.querySelectorAll(".btn-editar").forEach(b => {
        b.addEventListener("click", () => prepararEdicion(b.dataset.id));
    });
    document.querySelectorAll(".btn-borrar").forEach(b => {
        b.addEventListener("click", () => borrarSala(b.dataset.id));
    });
}


/* CREAR (POST) y ACTUALIZAR (PATCH) */
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    ocultarMensaje();

    if (!inputNombre.value.trim() || !inputCapacidad.value) {
        mostrarMensaje("Rellena el nombre y la capacidad.", "error");
        return;
    }

    const datos = {
        Nombre:    inputNombre.value.trim(),
        Capacidad: parseInt(inputCapacidad.value, 10)
    };

    const idActual = inputId.value;

    try {
        let respuesta;

        if (idActual) {
            // -ACTUALIZAR 
            respuesta = await fetch(`${URL_BASE}/${idActual}`, {
                method: "PATCH",
                headers: {
                    "Content-Type":  "application/json",
                    "Authorization": `Bearer ${TOKEN}`
                },
                body: JSON.stringify(datos)
            });
        } else {
            //  CREAR (POST) 
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

        mostrarMensaje(idActual ? "Sala actualizada correctamente." : "Sala creada correctamente.", "ok");
        resetearFormulario();
        cargarSalas();

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se ha podido guardar la sala. " + error.message, "error");
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
        const s = datos.data;

        inputId.value        = s.IDSala;
        inputNombre.value    = s.Nombre    || "";
        inputCapacidad.value = s.Capacidad || "";

        tituloFormulario.textContent = "Editando: " + (s.Nombre || "");
        btnGuardar.textContent       = "Actualizar";
        btnCancelar.classList.remove("oculto");

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al cargar la sala. " + error.message, "error");
    }
}


/*  CANCELAR EDICIÓN  */
btnCancelar.addEventListener("click", resetearFormulario);


/*  BORRAR (DELETE)  */
async function borrarSala(id) {

    if (!confirm("¿Seguro que quieres borrar esta sala?")) return;

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

        mostrarMensaje("Sala eliminada.", "ok");
        cargarSalas();

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se ha podido borrar la sala. " + error.message, "error");
    }
}


/*  UTILIDADES  */
function resetearFormulario() {
    formulario.reset();
    inputId.value                = "";
    tituloFormulario.textContent = "Añadir nueva sala";
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


/*  ARRANCAR */
cargarSalas();