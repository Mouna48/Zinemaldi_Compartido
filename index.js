document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.icono-buscar');
    const searchInput = document.querySelector('.search-container input');

    searchBtn.addEventListener('click', (e) => {
        if(searchInput.value.trim() === ''){
            e.preventDefault();
            alert('Por favor, escribe algo para buscar.');
            searchInput.focus();
        }
    });
});
