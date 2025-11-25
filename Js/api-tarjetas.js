// === Configuración inicial ===
const contenedorTarjetas = document.querySelector('.tarjetas');
const botonVerMas = document.getElementById('verMas');

let pagina = 0;
const recetasPorPagina = 6;
let recetas = [];

// ================================================================
// 🔥 Cargar TODAS las recetas de TODAS las categorías
// ================================================================
async function cargarTodasLasRecetas() {
    // 1) Obtener categorías
    const respCat = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
    const datosCat = await respCat.json();
    const categorias = datosCat.meals.map(c => c.strCategory);

    let todas = [];

    // 2) Para cada categoría traer recetas
    for (const categoria of categorias) {
        const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`);
        const datos = await resp.json();
        if (datos.meals) {
            datos.meals.forEach(r => r.strCategory = categoria); // Añadir categoría
            todas.push(...datos.meals);
        }
    }

    // 3) Eliminar duplicados
    const mapa = new Map();
    todas.forEach(r => mapa.set(r.idMeal, r));
    return Array.from(mapa.values());
}

// ================================================================
// Cargar recetas en pantalla
// ================================================================
async function cargarRecetas() {
    if (!contenedorTarjetas) return;

    recetas = await cargarTodasLasRecetas();
    mostrarRecetas();
}

// ================================================================
// Mostrar recetas en tarjetas
// ================================================================
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
                <span class="subtitulo">${receta.strCategory || "Sin categoría"}</span>
                <h3 class="titulo">${receta.strMeal}</h3>
            </div>
            <div class="acciones-tarjeta">
                <a class="enlace ver-receta" data-id="${receta.idMeal}" href="#">Ver receta</a>
                <button class="btn btn-guardar" data-id="${receta.idMeal}">Guardar</button>
            </div>
        `;
        contenedorTarjetas.appendChild(tarjeta);
    });

    pagina++;
    if (pagina * recetasPorPagina >= recetas.length) {
        botonVerMas.style.display = 'none';
    }
}

// ================================================================
// Modal detalle
// ================================================================
async function mostrarDetalle(id) {

    if (document.querySelector('.modal-personalizado.activo')) return;

    const respuesta = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const datos = await respuesta.json();
    const receta = datos.meals[0];

    const modal = document.createElement("div");
    modal.className = "modal-personalizado activo";

    modal.innerHTML = `
        <div class="contenido-modal modal-receta">
            <button class="cerrar-modal cerrarReceta">&times;</button>

            <h2>${receta.strMeal}</h2>

            <img src="${receta.strMealThumb}" alt="${receta.strMeal}" class="img-detalle">

            <h3>Ingredientes</h3>
            <ul class="lista-ingredientes">
                ${Object.keys(receta)
                    .filter(k => k.startsWith("strIngredient") && receta[k])
                    .map(k => `<li>• ${receta[k]}</li>`)
                    .join("")}
            </ul>

            <h3>Preparación</h3>
            <p>${receta.strInstructions}</p>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    modal.addEventListener("click", e => {
        if (e.target.classList.contains("cerrarReceta") || e.target === modal) {
            modal.remove();
            document.body.style.overflow = "auto";
        }
    });
}

// ================================================================
// Guardar receta (con categoría incluida)
// ================================================================
async function guardarReceta(id, boton) {
    const usuario = (localStorage.getItem("usuarioActivo") || "").trim();

    if (!usuario) {
        alert("Debes iniciar sesión para guardar recetas.");
        return;
    }

    const clave = "misRecetas_" + usuario;
    let guardadas = JSON.parse(localStorage.getItem(clave)) || [];

    if (guardadas.some(r => r.idMeal == id)) {
        boton.textContent = "Guardado ✓";
        return;
    }

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const datos = await resp.json();
    const recetaCompleta = datos.meals[0];

    guardadas.push({
        idMeal: recetaCompleta.idMeal,
        strMeal: recetaCompleta.strMeal,
        strMealThumb: recetaCompleta.strMealThumb,
        strCategory: recetaCompleta.strCategory
    });

    localStorage.setItem(clave, JSON.stringify(guardadas));

    boton.textContent = "Guardado ✓";
    boton.classList.add("guardado-exito");
}

// ================================================================
// Delegación de eventos
// ================================================================
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("ver-receta")) {
        e.preventDefault();
        mostrarDetalle(e.target.dataset.id);
    }

    if (e.target.classList.contains("btn-guardar")) {
        guardarReceta(e.target.dataset.id, e.target);
    }
});

// ================================================================
if (botonVerMas) {
    botonVerMas.addEventListener('click', mostrarRecetas);
}

// Inicializar
cargarRecetas();
