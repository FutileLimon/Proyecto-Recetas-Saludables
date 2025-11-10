// === Configuración inicial ===
const contenedorTarjetas = document.querySelector('.tarjetas');
const botonVerMas = document.getElementById('verMas');

let pagina = 0;
const recetasPorPagina = 6;
let recetas = [];

// === Cargar recetas desde la API ===
async function cargarRecetas() {
    try {
        const respuesta = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian');
        const datos = await respuesta.json();
        recetas = datos.meals;
        mostrarRecetas();
    } 
    catch (error) {
        console.error('Error al cargar recetas:', error);
    }
}

// === Mostrar recetas en tarjetas ===
function mostrarRecetas() {
    const inicio = pagina * recetasPorPagina;
    const fin = inicio + recetasPorPagina;
    const recetasAMostrar = recetas.slice(inicio, fin);

    recetasAMostrar.forEach(receta => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-receta');
        tarjeta.innerHTML = `
        <div class="imagen-receta" style="background-image:url('${receta.strMealThumb}')"></div>
        <div class="cuerpo-receta">
            <span class="subtitulo">Tendencia</span>
            <h3 class="titulo">${receta.strMeal}</h3>
        </div>
        <div class="acciones-tarjeta">
            <a class="enlace ver-receta" data-id="${receta.idMeal}" href="#">Ver receta</a>
            <button class="btn">Guardar</button>
        </div>
        `;
        contenedorTarjetas.appendChild(tarjeta);
    });

    pagina++;
    if (pagina * recetasPorPagina >= recetas.length) {
        botonVerMas.style.display = 'none';
    }

    activarBotones();
}