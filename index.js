document.addEventListener('DOMContentLoaded', () => {

    // 1. BOTÓN VOLVER ARRIBA (Global)
    const btnTop = document.getElementById("btnTop");
    if (btnTop) {
        window.addEventListener('scroll', () => { 
            if (window.scrollY > 200 || document.documentElement.scrollTop > 200) {
                btnTop.style.display = "block";
            } else {
                btnTop.style.display = "none";
            }
        });

        btnTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2. LÓGICA DEL BUSCADOR
    const searchBtn = document.querySelector('.icono-buscar');
    const searchInput = document.querySelector('.search-container input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            if(searchInput.value.trim() === ''){
                e.preventDefault();
                alert('Por favor, escribe algo para buscar.');
                searchInput.focus();
            }
        });
    }

    // 3. CARRUSEL (Index)
    const carrusel = document.getElementById("carruselPrincipal");
    if (carrusel) {
        const items = carrusel.querySelectorAll(".carrusel-item");
        const indicadores = carrusel.querySelectorAll(".carrusel-indicators button");
        let indiceActual = 0; 

        function mostrarDiapositiva(indiceNuevo) {
            if (indiceNuevo >= items.length) indiceNuevo = 0;
            else if (indiceNuevo < 0) indiceNuevo = items.length - 1;

            items[indiceActual].classList.remove("active");
            indicadores[indiceActual].classList.remove("active");
            indiceActual = indiceNuevo;
            items[indiceActual].classList.add("active");
            indicadores[indiceActual].classList.add("active");
        }

        carrusel.querySelectorAll(".carrusel-control-prev, .carrusel-control-next").forEach(control => {
            control.addEventListener("click", function() {
                const accion = this.getAttribute("data-slide"); 
                mostrarDiapositiva(accion === "next" ? indiceActual + 1 : indiceActual - 1);
            });
        });

        indicadores.forEach(indicador => {
            indicador.addEventListener("click", function() {
                mostrarDiapositiva(parseInt(this.getAttribute("data-slide-to")));
            });
        });
    }

    // 4. GALERÍA 
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const galleryImages = document.querySelectorAll(".galeria img");
    const closeBtn = document.querySelector(".close-btn");

    if (lightbox && lightboxImg) {
        galleryImages.forEach(img => {
            img.addEventListener("click", () => {
                lightbox.style.display = "flex"; 
                lightboxImg.src = img.src; 
            });
        });

        lightbox.addEventListener("click", (e) => {
            if (e.target !== lightboxImg || e.target === closeBtn) {
                lightbox.style.display = "none";
            }
        });
    }

    // 5. ANIMACIONES AL HACER SCROLL 
    const faders = document.querySelectorAll(".fade-in");
    if (faders.length > 0) {
        const appearOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.3 });

        faders.forEach(fader => appearOnScroll.observe(fader));
    }

    // 6. REDIRECCIÓN DE NOTICIAS
    const noticias = document.querySelectorAll(".noticia");
    if (noticias.length >= 4) {
        const paginas = [
            "noticia-domingos.html",
            "noticia-premio-especial.html",
            "noticia-invitados.html",
            "noticia-asistentes.html"
        ];
        noticias.forEach((noticia, index) => {
            noticia.style.cursor = "pointer";
            if (paginas[index]) {
                noticia.addEventListener("click", () => {
                    window.location.href = paginas[index];
                });
            }
        });
    }

    // 7. FORMULARIO DE CONTACTO (VALIDACIÓN EXTERNA EXIGIDA)
    // Este bloque cumple con los requisitos de validación de campos obligatorios,
    // formato de email, longitud de caracteres e impide el envío si hay errores.
    const formulario = document.getElementById('formContacto');
    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            const emailInput = document.getElementById("correo");
            const mensajeInput = document.getElementById("mensj");
            
            let errores = [];

            // Validación del formato de Email (Campos obligatorios y formato)
            if (emailInput.value.trim() === "") {
                errores.push("El campo correo es obligatorio.");
            } else if (!emailInput.value.includes("@")) {
                errores.push("El formato del correo no es válido (debe contener '@').");
            }

            // Validación de longitud del mensaje (Longitudes mínimas)
            if (mensajeInput.value.trim() === "") {
                errores.push("El mensaje no puede estar vacío.");
            } else if (mensajeInput.value.trim().length < 10) {
                errores.push("El mensaje debe ser más descriptivo (mínimo 10 caracteres).");
            }

            // Gestión de errores e impedimento de envío (PreventDefault)
            if (errores.length > 0) {
                event.preventDefault(); // Detiene el envío del formulario
                alert("⚠️ ERRORES EN EL FORMULARIO:\n\n" + errores.join("\n"));
            } else {
                // Si no hay errores, se procede con la lógica de negocio
                localStorage.setItem("emailGuardado", emailInput.value);
                localStorage.setItem("mensajeGuardado", mensajeInput.value);
                alert("✅ Formulario validado correctamente. ¡Datos guardados!");
            }
        });
    }

    // 8. LÓGICA BOTÓN BASE DE DATOS (DOCKER)
    const btnDB = document.querySelector('.btn-database');
    if (btnDB) {
        btnDB.addEventListener('click', (e) => {
            console.log("Intentando conectar con el servidor Docker...");
        });
    }
});