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
    // 7. FORMULARIO DE CONTACTO (LocalStorage)
    const formulario = document.getElementById('formContacto');
    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById("correo").value;
            const mensaje = document.getElementById("mensj").value;

            localStorage.setItem("emailGuardado", email);
            localStorage.setItem("mensajeGuardado", mensaje);

            alert("¡Datos guardados con éxito!!");
            formulario.reset();
        });
    }
});
// ==========================================
    // LÓGICA BOTÓN BASE DE DATOS (DOCKER)
    // ==========================================
    const btnDB = document.querySelector('.btn-database');
    if (btnDB) {
        btnDB.addEventListener('click', (e) => {
            // Un pequeño aviso en consola para saber que el enlace funciona
            console.log("Intentando conectar con el servidor Docker en el puerto 8080...");
        });
    }