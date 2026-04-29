
/* ----- 1. CONFIGURACIÓN ----- */
const URL_BASE = "http://localhost:8055/items/pelicula";   
const TOKEN    = "OYxtn1U7wdud0JfKVNDs4yULVKAcejZp";                       


/* ----- 2. REFERENCIAS AL DOM ----- */
const formulario        = document.getElementById("form-pelicula");
const tituloFormulario  = document.getElementById("titulo-formulario");
const inputId           = document.getElementById("pelicula-id");
const inputTitulo       = document.getElementById("titulo");
const inputDirector     = document.getElementById("director");
const inputDuracion     = document.getElementById("duracion");
const inputGenero       = document.getElementById("genero");
const inputAnio         = document.getElementById("anio");
const inputPais         = document.getElementById("pais");
const btnGuardar        = document.getElementById("btn-guardar");
const btnCancelar       = document.getElementById("btn-cancelar");
const cajaListado       = document.getElementById("listado-items");
const estadoCargando    = document.getElementById("estado-cargando");
const estadoError       = document.getElementById("estado-error");
const mensajeFormulario = document.getElementById("mensaje-formulario");


// ----- 3. LISTAR (GET) -----

async function cargarPeliculas() {

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
            throw new Error("Error al llamar a la API: " + respuesta.status + ": " + mensajeError.errors[0].message);
        }

        const datos = await respuesta.json();
        const peliculas = datos.data;   

        estadoCargando.classList.add("oculto");

        if (peliculas.length === 0) {
            cajaListado.innerHTML = "<p class='estado'>No hay películas registradas todavía.</p>";
        } else {
            pintarPeliculas(peliculas);
        }

    } catch (error) {
        console.error(error);
        estadoCargando.classList.add("oculto");
        estadoError.textContent = "No se han podido cargar las películas. " + error.message;
        estadoError.classList.remove("oculto");
    }
}


// ----- 4. PINTAR LAS TARJETAS -----
function pintarPeliculas(peliculas) {
    cajaListado.innerHTML = "";

    peliculas.forEach(p => {
        const card = document.createElement("article");
        card.className = "card-item";

        card.innerHTML = `
            <h3>${p.Titulo || "(Sin título)"}</h3>
            <p><strong>Director:</strong> ${p.Director || "-"}</p>
            <p><strong>Duración:</strong> ${p.Duracion || "-"} min</p>
            <p><strong>Género:</strong> ${p.Genero || "-"}</p>
            <p><strong>Año:</strong> ${p.AnioLanzamiento || "-"}</p>
            <p><strong>País:</strong> ${p.Pais || "-"}</p>
            <div class="acciones-card">
                <button class="btn-editar" data-id="${p.IDPelicula}">Editar</button>
                <button class="btn-borrar" data-id="${p.IDPelicula}">Borrar</button>
            </div>
        `;

        cajaListado.appendChild(card);
    });

    document.querySelectorAll(".btn-editar").forEach(b => {
        b.addEventListener("click", () => prepararEdicion(b.dataset.id));
    });
    document.querySelectorAll(".btn-borrar").forEach(b => {
        b.addEventListener("click", () => borrarPelicula(b.dataset.id));
    });
}


//----- 5. CREAR (POST) y ACTUALIZAR (PATCH) -----
  
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    ocultarMensaje();

    if (!inputTitulo.value.trim() || !inputDirector.value.trim() || !inputDuracion.value) {
        mostrarMensaje("Rellena al menos título, director y duración.", "error");
        return;
    }

    // Los nombres de las propiedades deben coincidir con las columnas de MySQL
    const datos = {
        Titulo:           inputTitulo.value.trim(),
        Director:         inputDirector.value.trim(),
        Duracion:         parseInt(inputDuracion.value, 10),
        Genero:           inputGenero.value.trim() || null,
        AnioLanzamiento:  inputAnio.value ? parseInt(inputAnio.value, 10) : null,
        Pais:             inputPais.value.trim() || null
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
            throw new Error("Error al llamar a la API: " + respuesta.status + ": " + mensajeError.errors[0].message);
        }

        mostrarMensaje(idActual ? "Película actualizada correctamente." : "Película creada correctamente.", "ok");
        resetearFormulario();
        cargarPeliculas();

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se ha podido guardar la película. " + error.message, "error");
    }
});


/* ----- 6. PREPARAR EDICIÓN -----
   Rellena el formulario con los datos de la película seleccionada. */
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
            throw new Error("Error al llamar a la API: " + respuesta.status + ": " + mensajeError.errors[0].message);
        }

        const datos = await respuesta.json();
        const p = datos.data;

        // Rellenamos el formulario con los nombres de columna reales
        inputId.value       = p.IDPelicula;
        inputTitulo.value   = p.Titulo           || "";
        inputDirector.value = p.Director         || "";
        inputDuracion.value = p.Duracion         || "";
        inputGenero.value   = p.Genero           || "";
        inputAnio.value     = p.AnioLanzamiento  || "";
        inputPais.value     = p.Pais             || "";

        tituloFormulario.textContent = "Editando: " + (p.Titulo || "");
        btnGuardar.textContent       = "Actualizar";
        btnCancelar.classList.remove("oculto");
        formulario.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al cargar la película. " + error.message, "error");
    }
}


/* ----- 7. CANCELAR EDICIÓN ----- */
btnCancelar.addEventListener("click", resetearFormulario);


/* ----- 8. BORRAR (DELETE) ----- */
async function borrarPelicula(id) {

    if (!confirm("¿Seguro que quieres borrar esta película?")) return;

    try {
        const respuesta = await fetch(`${URL_BASE}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${TOKEN}`
            }
        });

        // Directus devuelve 204 (sin contenido) cuando el borrado va bien
        if (!respuesta.ok && respuesta.status !== 204) {
            const mensajeError = await respuesta.json();
            throw new Error("Error al llamar a la API: " + respuesta.status + ": " + mensajeError.errors[0].message);
        }

        mostrarMensaje("Película eliminada.", "ok");
        cargarPeliculas();

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se ha podido borrar la película. " + error.message, "error");
    }
}


/* ----- 9. UTILIDADES ----- */
function resetearFormulario() {
    formulario.reset();
    inputId.value                = "";
    tituloFormulario.textContent = "Añadir nueva película";
    btnGuardar.textContent       = "Guardar";
    btnCancelar.classList.add("oculto");
}

function mostrarMensaje(texto, tipo) {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.className   = "mensaje " + tipo;   // "ok" o "error"
}

function ocultarMensaje() {
    mensajeFormulario.classList.add("oculto");
    mensajeFormulario.textContent = "";
}


/* ----- 10. ARRANQUE -----
   Al cargar la página, pedimos las películas automáticamente. */
cargarPeliculas();