document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del Buscador (Bloque 1) ---
    const searchBtn = document.querySelector('.icono-buscar');
    const searchInput = document.querySelector('.search-container input');

    searchBtn.addEventListener('click', (e) => {
        if(searchInput.value.trim() === ''){
            e.preventDefault();
            alert('Por favor, escribe algo para buscar.');
            searchInput.focus();
        }
    });

    // --- Lógica del Carrusel (Bloque 2) ---
    const carrusel = document.getElementById("carruselPrincipal");
    if (carrusel) {
        
        const items = carrusel.querySelectorAll(".carrusel-item");
        const indicadores = carrusel.querySelectorAll(".carrusel-indicators button");
        const numItems = items.length;
        let indiceActual = 0; 

        function mostrarDiapositiva(indiceNuevo) {
            
            if (indiceNuevo >= numItems) {
                indiceNuevo = 0;
            } else if (indiceNuevo < 0) {
                indiceNuevo = numItems - 1;
            }

            items[indiceActual].classList.remove("active");
            indicadores[indiceActual].classList.remove("active");

            indiceActual = indiceNuevo;

            items[indiceActual].classList.add("active");
            indicadores[indiceActual].classList.add("active");
        }

        // Manejar clics en los botones de control (PREV/NEXT)
        carrusel.querySelectorAll(".carrusel-control-prev, .carrusel-control-next").forEach(control => {
            control.addEventListener("click", function() {
                const accion = this.getAttribute("data-slide"); 

                if (accion === "next") {
                    mostrarDiapositiva(indiceActual + 1);
                } else if (accion === "prev") {
                    mostrarDiapositiva(indiceActual - 1);
                }
            });
        });

        // Manejar clics en los indicadores
        indicadores.forEach(indicador => {
            indicador.addEventListener("click", function() {
                const indiceObjetivo = parseInt(this.getAttribute("data-slide-to"));
                mostrarDiapositiva(indiceObjetivo);
            });
        });
        
        // Opcional: Auto-avance cada 5 segundos
        // setInterval(() => {
        //      mostrarDiapositiva(indiceActual + 1);
        // }, 5000);
    }
    
    // El script para btnTop se mantiene en el HTML por ahora, pero 
    // podrías moverlo aquí si quieres.
});